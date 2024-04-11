const { eq } = require('drizzle-orm');
const db = require('../../lib/drizzle-client');
const {
  users,
  feedback,
  students,
  courses,
  lectures,
  practicals,
  tutorials,
  professors,
} = require('../../db/schema');

const getAllLecturesLabsPracticals = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({
        message: 'Please provide all the required fields',
        dataFormat: { user_id: 'string' },
      });
    }
    const departmentId = (
      await db
        .select({
          departmentId: students.departmentId,
        })
        .from(students)
        .where(eq(students.userId, user_id))
    )[0].departmentId;
    // get courses for the department
    // console.log({ departmentId })
    const coursesForDepartment = await db
      .select()
      .from(courses)
      .where(eq(courses.departmentId, departmentId));
    // console.log({ coursesForDepartment });
    // get lectures, labs, practicals for each course

    let result = [];
    const professerIdToNameMap = {};
    const professorData = await db.select().from(professors);
    for (let i = 0; i < professorData.length; i++) {
      const professor = professorData[i];
      professerIdToNameMap[professor.professorId] = professor.name;
    }
    const courseIdToNameMap = {};
    const courseIdToCodeMap = {};
    const courseData = await db.select().from(courses);
    for (let i = 0; i < courseData.length; i++) {
      const course = courseData[i];
    //   console.log(course);
      courseIdToNameMap[course.courseId] = course.courseName;
      courseIdToCodeMap[course.courseId] = course.courseCode;
    }
    // console.log({ professerIdToNameMap, courseIdToNameMap });

    for (let i = 0; i < coursesForDepartment.length; i++) {
      const course = coursesForDepartment[i];
      const lectureData = [
        ...(await db
          .select()
          .from(lectures)
          .where(eq(lectures.courseId, course.courseId))),
      ];
      const tutData = [
        ...(await db
          .select()
          .from(tutorials)
          .where(eq(tutorials.courseId, course.courseId))),
      ];
      const practicalData = [
        ...(await db
          .select()
          .from(practicals)
          .where(eq(practicals.courseId, course.courseId))),
      ];
      result.push(
        lectureData.map((lecture) => ({ ...lecture, type: 'LECTURE' }))
      );
      result.push(tutData.map((tut) => ({ ...tut, type: 'TUTORIAL' })));
      result.push(
        practicalData.map((practical) => ({ ...practical, type: 'LAB' }))
      );
    }

    res.status(200).json({
      message: 'Test route works',
      data: result.flat().map((item) => ({
        ...item,
        professorName: professerIdToNameMap[item.professorId],
        courseName: courseIdToNameMap[item.courseId],
        courseCode: courseIdToCodeMap[item.courseId],
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
