const Leave = require("../../model/LeaveSchema");
const User = require("../../model/UserSchema");
const ObjectId = require("mongodb").ObjectId;
const Holiday = require("../../model/HolidaySchema");
const Attendance = require("../../model/AttendanceSchema");
const { sendMailAcceptedLeave } = require("../admin/sendMail");

exports.acceptLeave = async (req, res) => {
  const { _id } = req.body;
  try {
    const leave = await Leave.findByIdAndUpdate(new ObjectId(_id));

    if (!leave) {
      return res.status(404).json({ error: "No Leave found" });
    }

    leave.status = "accepted";

    let { employeeID, duration } = leave;

    const employee = await User.findByIdAndUpdate(employeeID);
    const attendanceS = await Attendance.findOne({employeeID:employeeID})

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const manager = await User.findOne({ _id: employee.info.manager });

    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }

    const accumulatedLeaves = employee.accumulatedLeaves;

    let remainingLeave = accumulatedLeaves;

const holidays = await Holiday.find();
const holidayDates = holidays.map(holiday => {
  const holidayDate = holiday.date.toISOString().split('T')[0];
  return holidayDate;
});

duration = duration.filter(period => {
  const periodDate = period.date.toISOString().split('T')[0];
  const isExcluded = !holidayDates.includes(periodDate);
  return isExcluded;
});


    duration.forEach((period, index) => {
      const amountToPay = Math.min(remainingLeave, period.value);
      period.paid = amountToPay;
      remainingLeave -= amountToPay;

      const modifiedAttendance = {
        date: period.date,
        value: 1 - period.value,
        paid: period.paid,
        markerName:"On Leave"
      };
      const modifiedLeave = {
        date: period.date,
        value:period.value,
        paid: period.paid,
      };
      leave.duration[index] = modifiedLeave;
      attendanceS.attendance.push(modifiedAttendance);

    });

    employee.accumulatedLeaves = remainingLeave;
    
    const savedEmployee = await employee.save();
    const savedLeave = await leave.save();
    const savedAttendance = await attendanceS.save();

    const employeeName = employee.info.name;
    const leaveId = savedLeave._id;
    const startDate = savedLeave.duration[0].date.toISOString().split('T')[0]; 
    const endDate = savedLeave.duration[0].date.toISOString().split('T')[0];
    const leaveReason = savedLeave.reason;
    const employeeEmail = employee.email;
    const managerName = manager.info.name;

    await sendMailAcceptedLeave( {      employeeName,
      managerName,
      leaveId,
      startDate,
      endDate,
      leaveReason,
      employeeEmail}
    );

    res.status(200).json(leave);
  } catch (error) {
    console.error("Error updating Leave status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
