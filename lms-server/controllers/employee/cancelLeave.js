const Leave = require("../../model/LeaveSchema");
const User = require("../../model/UserSchema");
const Attendance = require("../../model/AttendanceSchema");
const ObjectId = require('mongodb').ObjectId;
const { sendMailLeaveCancel } = require("../admin/sendCancelMail");

exports.cancelLeave = async (req, res) => {
    const { employeeId, leaveId, password } = req.body;
    console.log("received req.body >>>", req.body);
    const currDate = new Date();

    try {
        const employee = await User.findOne({ _id: employeeId });
        const leaveObj = await Leave.findOne({ _id: leaveId });
        const attendanceS = await Attendance.findOne({employeeID:employeeId})
        const manager = await User.findOne({ _id: new ObjectId(employee.info.manager) });
        const checkingDate = leaveObj.duration[0].date.toISOString().split("T")[0];
        const employeeName = employee.info.name;
        const managerName = manager.info.name;
        const startDate = leaveObj.duration[0].date.toISOString().split('T')[0];
        const endDate = leaveObj.duration[leaveObj.duration.length - 1].date.toISOString().split('T')[0];
        const leaveReason = leaveObj.reason;
        const managerEmail = manager.email;

        console.log("found leave >>>", leaveObj);
        const restoreLeave = leaveObj.duration.reduce((total, duration) => {
            total += duration.paid
            return total}, 0);
        console.log("restore>>",restoreLeave)
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        if (password !== employee.password) {
            console.log("password>>",password)
            console.log("employee,password>>>",employee.password);
            return res.status(400).json({ error: "Invalid password" });
        }

        if (leaveObj.status === "rejected" || leaveObj.status === "cancel") {
            console.log("leave.obj>>",leaveObj.status)
            return res.status(400).json({ error: "Leave already rejected or canceled" });
        }

        if (checkingDate < currDate.toISOString().split("T")[0]) {
            console.log("checking date>>>",checkingDate)
            console.log("currDate>>>",currDate.toISOString().split("T")[0])
            console.log(">>>",checkingDate < currDate.toISOString().split("T")[0])
            return res.status(400).json({ error: "Leave date already passed" });
        }

        const leave = await Leave.findByIdAndUpdate(
            { _id: new ObjectId(leaveId) },
            {
                $set: {
                    'status': "cancel"
                }
            },
            { new: true }
        );

        console.log("canceled leave >>>", leave);

        if (!leave) {
            return res.status(404).json({ error: "Leave not found" });
        }

        await User.updateOne(
            { _id: employeeId },
            {   
                $inc: { accumulatedLeaves: restoreLeave } // Increment accumulatedLeaves by restoreLeave
            }
        );
        await Attendance.updateOne(
            {employeeID:employeeId},
            {
                $pull: {
                    attendance: {
                        date: { $in: leave.duration.map(d => d.date.toISOString().split("T")[0]) }
                    }
                },
            }            
        )
        const savedAttendance=await attendanceS.save();
        console.log("saved employee>>",employee)

        await sendMailLeaveCancel({
            employeeName,
            managerName,
            leaveId,
            startDate,
            endDate,
            leaveReason,
            managerEmail
        });
    
        res.status(200).json({ message: "Leave canceled successfully", leave });
    } catch (error) {
        console.error('Error canceling leave:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
