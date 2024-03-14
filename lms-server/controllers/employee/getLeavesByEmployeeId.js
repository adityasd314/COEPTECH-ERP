const Leave = require("../../model/LeaveSchema");
const ObjectId = require("mongodb").ObjectId;

exports.getLeavesByEmployeeId = async (req, res) => {
  const { employeeId } = req.body;
  
  try {
    const leavesForEmployee = await Leave.find({ employeeID: new ObjectId(employeeId) });


    if (!leavesForEmployee || leavesForEmployee.length === 0) {
      return res.status(404).json({ error: "No Leaves found for the specified employeeId" });
    }

    res.status(200).json(leavesForEmployee);
  } catch (error) {
    console.error("Error fetching Leaves:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
