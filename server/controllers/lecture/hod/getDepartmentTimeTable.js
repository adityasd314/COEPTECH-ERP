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
      const professerIdToNameMap = {}
      const courseIdToCourseMap = {}
    
      const [data, professorData, courseData] =await Promise.all( [ db.select().from(timetable).where(eq(timetable.departmentId, departmentId)), db.select().from(professors).where(eq(professors.departmentId, departmentId)), db.select().from(courses)]);
      professorData.forEach((professor) => {
        professerIdToNameMap[professor.professorId] = professor;
      })
      courseData.forEach((course) => {
        courseIdToCourseMap[course.courseId] = course;
      })

      

      res.status(200).json({ message: "Time table fetched", data: data.map((timeTable) => ({ ...timeTable, professorName: professerIdToNameMap[timeTable.professorId]?.name, professorPosition: professerIdToNameMap[timeTable.professorId]?.position, courseName:courseIdToCourseMap[timeTable.courseId].courseName,courseCode:courseIdToCourseMap[timeTable.courseId].courseCode   })) });
      
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
module.exports = {
    getDepartmentTimeTable
}