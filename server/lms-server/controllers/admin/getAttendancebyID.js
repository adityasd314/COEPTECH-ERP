const Attendance = require("../../model/AttendanceSchema");
const ObjectId = require('mongodb').ObjectId;
exports.getAttendancebyID = async (req, res) => {
  const { _id } = req.query; // Retrieve _id from query parameters
  try {
    const attendanceData = await Attendance.findOne({ employeeID: new ObjectId(_id) });
    return res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
