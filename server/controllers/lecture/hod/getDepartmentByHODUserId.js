const { eq } = require('drizzle-orm');
const db = require('../../../lib/drizzle-client');
const {
  users,
  feedback,
  students,
  courses,
  lectures,
  practicals,
  tutorials,
  professors,
  headsOfDepartment,
} = require('../../../db/schema');

const getDepartmentByHODUserId = async (req, res) => {
    try {
      const { userId } = req.body;
      console.log({userId})
      if (!userId) {
        return res.status(400).json({ message: "Please provide all the required fields", dataFormat: { userId: "string" } });
      }

      const departmentId = (await db.select({
        departmentId: headsOfDepartment.departmentId,
      }).from(headsOfDepartment).where(eq(headsOfDepartment.userId, userId))[0]?.departmentId);
      if (!departmentId) {
        return res.status(404).json({ message: "HOD not found" });
      }
      res.status(200).json({ message: "Department fetched", data: { departmentId } });
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
module.exports = {
    getDepartmentByHODUserId
}