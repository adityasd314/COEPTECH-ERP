const User = require("../../model/UserSchema");
const Leave = require("../../model/LeaveSchema");
const ObjectId = require('mongodb').ObjectId;
const Attendance = require("../../model/AttendanceSchema");

exports.markAttendance = async (req, res) => {
    const { employeeId, attendance, password, markerId } = req.body;

    try {
        const employee = await User.findById(new ObjectId(employeeId));
        const marker = await User.findById(new ObjectId(markerId));
        const attendances = await Attendance.findOne({ employeeID: employeeId });


        console.log("Employee found:", employee);
        console.log("Marker found:", marker);
        console.log("Attendance found:", attendance);
        
        
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        if (!attendance) {
            return res.status(404).json({ error: "Attendance not found" });
        }
        if (!marker) {
            return res.status(404).json({ error: "Marker not found" });
        }

        if (password !== marker.password) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const currentDate = new Date(attendance.date).toDateString();

        const isDateAlreadyExists = attendances.attendance.some(entry => {
            const entryDate = new Date(entry.date).toDateString();
            return entryDate === currentDate;
        });
        if (isDateAlreadyExists && (marker.role !== "admin" && marker.role !== "manager")) {
            return res.status(400).json({ error: "Attendance for the current date already marked" });
        }
        if (isDateAlreadyExists && (employee.role === "manager" && marker.role === "manager")) {
            return res.status(400).json({ error: "Attendance for the current date already marked" });
        }
        if (isDateAlreadyExists && (marker.role === "admin" || marker.role === "manager")) {
          const existingAttendanceIndex = employee.attendance.findIndex(entry => {
              const entryDate = new Date(entry.date).toDateString();
              return entryDate === currentDate;
          });

          if (existingAttendanceIndex !== -1) {
              // Update the existing attendance entry
              attendances.attendance[existingAttendanceIndex] = {...attendance, markerName: marker.info.name};

              // Deduct leaves for half day or holiday
              if (attendance.value < 1) {
                  const accLeave = employee.accumulatedLeaves;
                  const deduction = Math.min(attendance.value, accLeave); // Deduct leaves for half day or holiday
                  const remainingLeaves = accLeave - deduction;

                  // Create leave entry
                  const leaveData = {
                      employeeID: employeeId,
                      reason: "Marked Absent",
                      duration: [{ date: attendance.date, value: 1 - attendance.value, paid: deduction }],
                      status: "accepted",
                  };

                  const newLeave = new Leave(leaveData);
                  const savedLeave = await newLeave.save();
                  employee.leaves.push(savedLeave._id);
                  employee.accumulatedLeaves = remainingLeaves;
              }
          }
      } else {   // When half day or holiday
            if (attendance.value < 1) {
                const accLeave = employee.accumulatedLeaves;
                const deduction = Math.min(attendance.value, accLeave); // Deduct leaves for half day or holiday
                const remainingLeaves = accLeave - deduction;

                // Create leave entry
                const leaveData = {
                    employeeID: employeeId,
                    reason: "Marked Absent",
                    duration: [{ date: attendance.date, value: 1 - attendance.value, paid: deduction }],
                    status: "accepted",
                };

                const newLeave = new Leave(leaveData);
                const savedLeave = await newLeave.save();
                employee.leaves.push(savedLeave._id);
                employee.accumulatedLeaves = remainingLeaves;
            }

            console.log("Attendance: ", attendance);
            attendances.attendance.push({...attendance, markerName: marker.info.name});
        }

        const savedAttendance = await attendances.save();
        res.status(201).json({ savedAttendance });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
