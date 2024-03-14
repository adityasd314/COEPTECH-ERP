const User = require("../../model/UserSchema");
const DeletedUser = require("../../model/DeletedUserSchema");
const Attendance = require("../../model/AttendanceSchema");

exports.deleteEmployee = async (req, res) => {
  const { adminId, employeeId, password } = req.body;

  try {
    const employee = await User.findOne({ _id: employeeId });
    const admin = await User.findOne({ _id: adminId });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    if (!admin) {
      return res.status(404).json({ error: "You are not authorised to delete an Employee" });
    }

    if (password !== admin.password) {
      return res.status(401).json({ error: "Invalid password for Admin" });
    }

    const deletedUser = new DeletedUser({
      ...employee.toObject(), 
      dateOfDeletion: new Date(), 
    });

    await deletedUser.save();

    await User.deleteOne({ _id: employeeId });
    await Attendance.deleteOne({employeeID:employeeId})

    res.status(200).json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};