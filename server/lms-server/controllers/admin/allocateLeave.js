const User = require("../../model/UserSchema");
const Leave = require("../../model/LeaveSchema");
const ObjectId = require('mongodb').ObjectId;

exports.allocateLeaves = async (req, res) => {
  const { employees, adminId, password } = req.body;
  console.log("received : ", req.body);

  try {

    const admin = await User.findById(new ObjectId(adminId));

    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    const updatedEmployees = await Promise.all(
      employees.map(async (employeeId) => {
        try {
          const user = await User.findById(new ObjectId(employeeId));

          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

          if (user.joiningdate.toISOString().split('T')[0] > sixMonthsAgo.toISOString().split('T')[0]) {
            return res.status(400).json({ error: "Employee has not completed six months. Leaves not allowed." });
          }

          const whetherAssigned = user.assignedAccumulatedLeaves
          .some(obj => new Date(obj.date).getMonth() === new Date().getMonth());

          if (whetherAssigned) {
            return res.status(400).json({ error: "Leaves are already assigned for this month" });
          }

          const previousMonthPaidSum = user.attendance
            .filter((entry) => new Date(entry.date).getMonth() === new Date().getMonth() - 1)
            .reduce((sum, entry) => sum + (entry.value || 0), 0);

          const eligibleAL =
            previousMonthPaidSum >= 21
              ? 2
              : previousMonthPaidSum <= 22 && previousMonthPaidSum >= 12
              ? 1
              : 0;

          user.accumulatedLeaves += eligibleAL;
          const today = new Date();
          user.assignedAccumulatedLeaves.push({ date: today, value: eligibleAL});

          const savedEmployee = await user.save();

         const sanitizedEmployee = JSON.parse(JSON.stringify(savedEmployee));

         return sanitizedEmployee;
        } catch (error) {
          console.error("Error updating leaves for employee:", employeeId, error);
          return null;
        }
      })
    );

    res.status(201).json({ updatedEmployees });
  } catch (error) {
    console.error("Error updating leaves for employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
