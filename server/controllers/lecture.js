const { eq } = require('drizzle-orm');
const db = require("../lib/drizzle-client");
const { users,feedback, students, courses, lectures, practicals, tutorials, professors } = require("../db/schema");
const { type } = require('os');

const getAllLecturesLabsPracticals = async (req, res) => {
  const { user_id } = req.body;
  const departmentId = (await db.select({
    departmentId: students.departmentId,
  }).from(students).where(eq(students.userId, user_id)))[0].departmentId
  // get courses for the department
  console.log({ departmentId })
  const coursesForDepartment = await db.select().from(courses).where(eq(courses.departmentId, departmentId));
  console.log({ coursesForDepartment })
  // get lectures, labs, practicals for each course

  let result = [];
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
  console.log({ professerIdToNameMap, courseIdToNameMap })

  
  for (let i = 0; i < coursesForDepartment.length; i++) {
    const course = coursesForDepartment[i];
    const lectureData = [...(await db.select().from(lectures).where(eq(lectures.courseId, course.courseId)))];
    const tutData = [...(await db.select().from(tutorials).where(eq(tutorials.courseId, course.courseId)))]
    const practicalData = [...(await db.select().from(practicals).where(eq(practicals.courseId, course.courseId)))];
    result.push(lectureData.map((lecture) => ({ ...lecture, type: "LECTURE" })));
    result.push(tutData.map((tut) => ({ ...tut, type: "TUTORIAL" })));
    result.push(practicalData.map((practical) => ({ ...practical, type: "LAB" })))
  }


  res.status(200).json({ message: "Test route works", data: result.flat().map((item) => ({ ...item, professorName: professerIdToNameMap[item.professorId], courseName: courseIdToNameMap[item.courseId], })) });
}
const submitFeedback = async (req, res) => {
  const {userId, courseId, sessionType, sessionId,data:feedbackText, professorId, departmentId} = req.body;
  const date_time = new Date().toISOString();

const studentId = (await db.select({
  studentId: students.studentId,
}).from(students).where(eq(students.userId, userId)))[0].studentId;
  const dataObj = JSON.parse(feedbackText);
  const rating = dataObj["overall satisfaction0"];
  const insertedRows = await db.insert(feedback).values({
    studentId,
    sessionType,
    sessionId,
    feedbackText,
    rating,
    date_time,
    departmentId,
    professorId,

    courseId,
  }).returning({ feedbackId: feedback.feedbackId });

  res.status(200).json({ message: "Feedback sent", insertedRows });
}
const updateLectureState = async (req, res) => {
  const { lectureId, state } = req.body;
  await db.update(lectures).set({ state }).where(eq(lectures.lectureId, lectureId));
  res.status(200).json({ message: "Lecture state updated" });
}
const updateTutorialState = async (req, res) => {
  const { tutorialId, state } = req.body;
  await db.update(tutorials).set({ state }).where(eq(tutorials.tutorialId, tutorialId));
  res.status(200).json({ message: "Tutorial state updated" });
}
const updatePracticalState = async (req, res) => {
  const { practicalId, state } = req.body;
  await db.update(practicals).set({ state }).where(eq(practicals.practicalId, practicalId));
  res.status(200).json({ message: "Practical state updated" });
}
module.exports = {
  getAllLecturesLabsPracticals
  , updateLectureState
  , updateTutorialState
  , updatePracticalState
  ,submitFeedback
};
