const Attendance = require("../../model/AttendanceSchema");
const ObjectId = require('mongodb').ObjectId;

exports.getAttendancebyMY = async (req, res) => {
  const { _id, month, year } = req.query; // Retrieve _id, month, and year from query parameters
  try {
    // Find attendance data for the given employee ID
    const attendanceData = await Attendance.findOne({ employeeID: new ObjectId(_id) });
    // Filter attendance for the specified month and year
    const filteredAttendance = attendanceData.attendance.filter(item => {
      const date = new Date(item.date);
      return date.getFullYear() === parseInt(year) && date.getMonth() === getMonthIndex(month);
    });
    return res.status(200).json(filteredAttendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Function to get the numerical index of the month
function getMonthIndex(month) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months.indexOf(month);
}
