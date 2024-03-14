const Employee = require("../../model/UserSchema");
const ObjectId = require('mongodb').ObjectId;

exports.getAllEmployees = async (req, res) => {
  const { managerId } = req.body;
  try {

    const manager = await Employee.findById(new ObjectId(managerId));

    if (!manager) {
      return res.status(404).json({ error: "Manager not found with the specified managerId" });
    }

    if (manager.role === 'admin') {
      const allEmployees = await Employee.find({ 'role': { $ne: 'admin' } });
      return res.status(200).json(allEmployees);
    } else {
      const employees = await Employee.find({ 'info.manager': managerId });
      return res.status(200).json(employees);
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
