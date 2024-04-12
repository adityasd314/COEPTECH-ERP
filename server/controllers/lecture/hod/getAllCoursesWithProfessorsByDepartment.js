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
} = require('../../../db/schema');

const getAllCoursesWithProfessorsByDepartment = async (req, res) => {
    try {
      const { departmentId } = req.body;
      if (!departmentId) {
        return res.status(400).json({ message: "Please provide all the required fields", dataFormat: { departmentId: "string" } });
      }

    
      const [coursesForDepartment, professorForDepartment] = await Promise.all([db.select().from(courses).where(eq(courses.departmentId, departmentId)), db.select().from(professors).where(eq(professors.departmentId, departmentId))]);
      professorIdToNameMap = {}
      professorForDepartment.forEach((professor) => {
        professorIdToNameMap[professor.professorId] = professor;
      });
      
      const courseIdToNameMap = {}
      const courseData = await db.select().from(courses)
      for (let i = 0; i < courseData.length; i++) {
        const course = courseData[i];
        courseIdToNameMap[course.courseId] = course.courseName;
      }
      res.status(200).json({ message: "Courses fetched", data: coursesForDepartment.map((course) => ({ ...course, courseName: courseIdToNameMap[course.courseId], professorName: professorIdToNameMap[course.professorId]?.name, professorPosition: professorIdToNameMap[course.professorId]?.position })) });
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

module.exports = {
    getAllCoursesWithProfessorsByDepartment
}
