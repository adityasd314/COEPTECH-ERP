const Employee = require("../../model/UserSchema");
const ObjectId = require('mongodb').ObjectId;

exports.getEmployeeById = async (req, res) => {
  const { _id } = req.body;

  try {
    const employee = await Employee.findById(new ObjectId(_id));

    if (!employee) {
      return res.status(404).json({ error: "No Employee found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching Employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  
};
