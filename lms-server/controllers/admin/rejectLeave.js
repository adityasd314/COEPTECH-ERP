const Leave = require("../../model/LeaveSchema");
const User = require("../../model/UserSchema");
const ObjectId = require("mongodb").ObjectId;
const { sendMailRejectedLeave  } = require("../admin/sendMail");

exports.rejectLeave = async (req, res) => {
  const { _id, note } = req.body;
  try {
    const leave = await Leave.findByIdAndUpdate(new ObjectId(_id));

    if (!leave) {
      return res.status(404).json({ error: "No Leave found" });
    }

    leave.status = "rejected";
    leave.note = note;

    const savedLeave = await leave.save();

    const { employeeID } = leave;

    const employee = await User.findByIdAndUpdate(employeeID);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const manager = await User.findOne({ _id: employee.info.manager });

    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }

    const employeeName = employee.info.name;
    const leaveId = savedLeave._id;
    const startDate = savedLeave.duration[0].date.toISOString().split('T')[0]; 
    const endDate = savedLeave.duration[0].date.toISOString().split('T')[0];
    const leaveReason = savedLeave.reason;
    const employeeEmail = employee.email;
    const managerName = manager.info.name;

    await sendMailRejectedLeave ( {employeeName,
      managerName,
      leaveId,
      startDate,
      endDate,
      leaveReason,
      employeeEmail}
    );

    res.status(200).json(savedLeave);
  } catch (error) {
    console.error("Error updating Leave status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
