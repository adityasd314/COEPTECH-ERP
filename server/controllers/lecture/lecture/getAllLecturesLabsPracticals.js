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

const getAllLecturesLabsPracticals = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({
        message: 'Please provide all the required fields',
        dataFormat: { user_id: 'string' },
      });
    }
    const { studentId } = (
      await db
        .select({
          studentId: students.studentId,
          departmentId: students.departmentId,
        })
        .from(students)
        .where(eq(students.userId, user_id))
    )[0];
    let departmentId = 3;
    // get courses for the department
    console.log({ departmentId, studentId });
    const coursesForDepartment = await db
      .select()
      .from(courses)
      .where(eq(courses.departmentId, departmentId));
    // console.log({ coursesForDepartment });
    // get lectures, labs, practicals for each course

    let result = [];
    const professerIdToNameMap = {};
    const courseIdToNameMap = {};
    const courseIdToCodeMap = {};
    const courseIdToDepartmentMap = {};
    const [professorData, courseData, feedbackData] = await Promise.all([
      db.select().from(professors),
      db.select().from(courses),
      db.select().from(feedback).where(eq(feedback.studentId, studentId)),
    ]);
    const courseIdToFeedbackMap = {};
    feedbackData.forEach((feedback) => {
      courseIdToFeedbackMap[feedback.courseId] = feedback;
    });
    console.log({ courseIdToFeedbackMap });

    professorData.forEach((professor) => {
      professerIdToNameMap[professor.professorId] = professor.name;
    });
    courseData.forEach((course) => {
      courseIdToNameMap[course.courseId] = course.courseName;
      courseIdToCodeMap[course.courseId] = course.courseCode;
      courseIdToDepartmentMap[course.courseId] = course.departmentId;
    });
    // console.log({ professerIdToNameMap, courseIdToNameMap });

    for (let i = 0; i < coursesForDepartment.length; i++) {
      const course = coursesForDepartment[i];

      const [lectureData, tutData, practicalData] = await Promise.all([
        db
          .select()
          .from(lectures)
          .where(eq(lectures.courseId, course.courseId)),
        db
          .select()
          .from(tutorials)
          .where(eq(tutorials.courseId, course.courseId)),
        db
          .select()
          .from(practicals)
          .where(eq(practicals.courseId, course.courseId)),
      ]);
      console.log({ lectureData, tutData, practicalData });
      result.push(
        lectureData.map((lecture) => ({
          ...lecture,
          id: lecture.lectureId,
          type: 'LECTURE',
        }))
      );
      result.push(
        tutData.map((tut) => ({ ...tut, id: tut.tutorialId, type: 'TUTORIAL' }))
      );
      result.push(
        practicalData.map((practical) => ({
          ...practical,
          id: practical.practicalId,
          type: 'LAB',
        }))
      );
    }

    res.status(200).json({
      message: 'Test route works',
      data: result.flat().map((item) => ({
        ...item,
        feedback: courseIdToFeedbackMap[item.courseId] || false,
        professorName: professerIdToNameMap[item.professorId],
        courseName: courseIdToNameMap[item.courseId],
        courseCode: courseIdToCodeMap[item.courseId],
        departmentId: courseIdToDepartmentMap[item.courseId],
      })),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
module.exports = {
  getAllLecturesLabsPracticals,
};
