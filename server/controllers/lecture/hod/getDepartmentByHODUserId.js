const db = require("../../../lib/drizzle-client");
const { users,feedback, students, courses, lectures, practicals, tutorials, professors } = require("../../../db/schema");
const { eq } = require('drizzle-orm');
const getDepartmentByHODUserId = async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "Please provide all the required fields", dataFormat: { userId: "string" } });
      }
      const departmentId = (await db.select({
        departmentId: professors.departmentId,
      }).from(professors).where(eq(professors.userId, userId))[0].departmentId);
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