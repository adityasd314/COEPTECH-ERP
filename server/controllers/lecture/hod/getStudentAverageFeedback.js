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

const getStudentAverageFeedback = async (req, res) => {
    try {
      const { professorsId } = req.body;
      
      
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
module.exports = {
    getStudentAverageFeedback
}