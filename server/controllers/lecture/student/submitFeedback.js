const { eq } = require('drizzle-orm');
const db = require("../../../lib/drizzle-client");
const { users,feedback, students, courses, lectures, practicals, tutorials, professors } = require("../../../db/schema");


const submitFeedback = async (req, res) => {
  try{const {userId, courseId, sessionType, sessionId,data:feedbackText, professorId, departmentId} = req.body;
  if (!userId || !courseId || !sessionType || !sessionId || !feedbackText || !professorId || !departmentId) {
    return res.status(400).json({ message: "Please provide all the required fields", dataFormat: { userId: "string", courseId: "string", sessionType: "string", sessionId: "string", data: "object", professorId: "string", departmentId: "string" }});
  }
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

  res.status(200).json({ message: "Feedback sent", insertedRows });}
  catch(err){
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  submitFeedback
};