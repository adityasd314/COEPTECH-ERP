const User = require("../../model/UserSchema");
const Attendance = require("../../model/AttendanceSchema");
const { ObjectId } = require("mongoose").Types; 

exports.addEmployees = async (req, res) => {
  try {
    const { employees } = req.body;
    console.log("employees>>>",employees)
    if (!employees || !Array.isArray(employees)) {
      return res.status(400).json({ error: 'Invalid input. Expecting an array of employees.' });
    }

    const savedUsers = [];

    for (const userData of employees) {
      try {
        const { name, age, email, department,joiningdate ,phone_number, manager, role } = userData;

        const password = name.split(' ')[0] + "@coep";

        const employee = {
          role,
          accumulatedLeaves: 0,
          email,
          password,
          info: {
            name,
            age,
            email,
            phone_number,
            manager,
            department,
            joiningdate,
          }
        } 

        if (manager === "admin") {
          const adminUser = await User.findOne({ role: "admin" });
            if (adminUser) {
            employee.info.manager = adminUser._id;
          } else {
            console.error('Admin user not found in the database.');
            return res.status(500).json({ error: 'Internal Server Error' });
          }
        } else {
          employee.info.manager = manager;
        }


        const savedUser = await User.create(employee);
        const newattendance = {
          employeeID:savedUser._id,
          attendance:[]
        }
        const attendance = await Attendance(newattendance);
        const savedAttendance = await attendance.save();
        savedUsers.push(savedUser);
        console.log("Attendance created : ", savedAttendance);
        console.log("Employee created : ", employee);
      } catch (error) {
        console.error('Error adding user:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }

    res.status(201).json({ savedUsers });
  } catch (error) {
    console.error('Unexpected error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
