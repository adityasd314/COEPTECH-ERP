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
  timetable
} = require('../../../db/schema');

const getDepartmentTimeTable = async (req, res) => {
    try {
      const { departmentId } = req.body;
      if (!departmentId) {
        return res.status(400).json({ message: "Please provide all the required fields", dataFormat: { departmentId: "string" } });
      }
      const data = await db.select().from(timetable).where(eq(timetable.departmentId, departmentId));
      res.status(200).json({ message: "Time table fetched", data });
      
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
module.exports = {
    getDepartmentTimeTable
}