const { eq } = require('drizzle-orm');
const db = require("../../lib/drizzle-client");
const { users,feedback, students, courses, lectures, practicals, tutorials, professors } = require("../../db/schema");

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

const getAllCoursesWithProfessorsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.body;
    if (!departmentId) {
      return res.status(400).json({ message: "Please provide all the required fields", dataFormat: { departmentId: "string" } });
    }
    const coursesForDepartment = await db.select().from(courses).where(eq(courses.departmentId, departmentId));
    const professerIdToNameMap = {}
    const professorData = await db.select().from(professors)
    for (let i = 0; i < professorData.length; i++) {
      const professor = professorData[i];
      professerIdToNameMap[professor.professorId] = professor.name;
    }
    const courseIdToNameMap = {}
    const courseData = await db.select().from(courses)
    for (let i = 0; i < courseData.length; i++) {
      const course = courseData[i];
      courseIdToNameMap[course.courseId] = course.courseName;
    }
    res.status(200).json({ message: "Courses fetched", data: coursesForDepartment.map((course) => ({ ...course, professorName: professerIdToNameMap[course.professorId] })) });
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  submitFeedback
};