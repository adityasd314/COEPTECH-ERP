const Attendance = require("../../model/AttendanceSchema");

exports.getTodayAttendance = async (req, res) => {
  const { _id } = req.query;
  const curr = new Date().toDateString()
  try {
    const attendanceData = await Attendance.findOne({ employeeID: _id });
    const activityExists = attendanceData?attendanceData.attendance.find(activity => {
      activity.date.toDateString() === curr;
      return activity
  }):[];
  return res.status(200).json(activityExists);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
