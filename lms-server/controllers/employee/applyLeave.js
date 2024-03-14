const Leave = require("../../model/LeaveSchema");
const User = require("../../model/UserSchema");
const { sendMailLeaveApply } = require("../admin/sendMail");
const Attendance = require("../../model/AttendanceSchema");

exports.applyLeave = async (req, res) => {
  const { employeeID, reason, duration, status } = req.body;
  console.log("recieved:",req.body)
  try {
    const employee = await User.findOne({ _id: employeeID });
    const attendanceS = await Attendance.findOne({employeeID:employeeID})

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    
    const manager = await User.findOne({ _id: employee.info.manager });

    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }
    
    if (!Array.isArray(duration) || duration.length === 0) {
      return res.status(400).json({ error: "Invalid duration data" });
    }

    const attendanceDates = attendanceS.attendance.map((entry) => entry.date.toISOString().split('T')[0]);
    const invalidDates = duration.filter((leave) => {
      const leaveDate = new Date(leave.date);
      return attendanceDates.includes(leaveDate.toISOString().split('T')[0]);
    });

    if (invalidDates.length > 0) {
      return res.status(400).json({ error: "Some leave dates overlap with attendance dates" });
    }

    const leaveData = {
      employeeID,
      reason,
      duration,
      status,
    };
    const newLeave = new Leave(leaveData);
    const savedLeave = await newLeave.save();
    employee.leaves.push(savedLeave._id);

    const savedEmployee = await employee.save();

    const employeeName = employee.info.name;
    const leaveId = savedLeave._id;
    const startDate = savedLeave.duration[0].date.toISOString().split('T')[0]; 
    const endDate = savedLeave.duration[0].date.toISOString().split('T')[0];
    const leaveReason = savedLeave.reason;
    const managerEmail = manager.email;
    const managerName = manager.info.name;

    await sendMailLeaveApply( {employeeName,
      managerName,
      leaveId,
      startDate,
      endDate,
      leaveReason,
      managerEmail}
    );

    res.status(201).json({ leave: savedLeave, employee: savedEmployee });
  } catch (error) {
    console.error("Error applying for leave:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};