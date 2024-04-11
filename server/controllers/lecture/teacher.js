const { eq } = require('drizzle-orm');
const db = require("../../lib/drizzle-client");
const { users, feedback, students, courses, lectures, practicals, tutorials, professors } = require("../../db/schema");
// lets do proper error handling

const updateLectureState = async (req, res) => {
    try{
    const { lectureId, state } = req.body;
    if (!lectureId || !state) {
        res.status(400).json({ message: "Invalid data",dataFormat: { lectureId: "string", state: "string" }});
        return;
    }
    await db.update(lectures).set({ state }).where(eq(lectures.lectureId, lectureId));
    res.status(200).json({ message: "Lecture state updated" });}
    catch(err){
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" });}
}
const updateTutorialState = async (req, res) => {
   try{ const { tutorialId, state } = req.body;
    if (!tutorialId || !state) {
        res.status(400).json({ message: "Invalid data",dataFormat: { tutorialId: "string", state: "string" }});
        return;
    }
    await db.update(tutorials).set({ state }).where(eq(tutorials.tutorialId, tutorialId));
    res.status(200).json({ message: "Tutorial state updated" });}catch(err){
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" });}
}
const updatePracticalState = async (req, res) => {
  try{  const { practicalId, state } = req.body;
    if (!practicalId || !state) {
        res.status(400).json({ message: "Invalid data",dataFormat: { practicalId: "string", state: "string" }});
        return;
    }
    await db.update(practicals).set({ state }).where(eq(practicals.practicalId, practicalId));
    res.status(200).json({ message: "Practical state updated" });}catch(err){
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" });}
}
const getProfessorIdByUserId = async (req, res) => {
    try{
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({ message: "Invalid data",dataFormat: { userId: "string" }});
        return;
    }
    const professorId = (await db.select().from(professors).where(eq(professors.userId, userId)))[0].professorId;
    res.status(200).json({ message: "Professor Id fetched", data: { professorId } });}
    catch(err){
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" });}

}

const getScheduleForProfessor = async (req, res) => {
    try{
    const { professorId } = req.body;
    if (!professorId) {
        res.status(400).json({ message: "Invalid data",dataFormat: { professorId: "string" }});
        return;
    }
    const courseIdToNameMap = {}
    const courseData = await db.select().from(courses)
    for (let i = 0; i < courseData.length; i++) {
      const course = courseData[i];
      courseIdToNameMap[course.courseId] = course.courseName;
    }
    
    const lecturesData = (await db.select().from(lectures).where(eq(lectures.professorId, professorId))).map((lecture) => ({ ...lecture, type: "LECTURE" }));;
    const tutorialsData = (await db.select().from(tutorials).where(eq(tutorials.professorId, professorId))).map((tutorial) => ({ ...tutorial, type: "TUTORIAL" }));;
    const practicalsData = (await db.select().from(practicals).where(eq(practicals.professorId, professorId))).map((practical) => ({ ...practical, type: "LAB" }));
    const result = [...lecturesData, ...tutorialsData, ...practicalsData].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)).map((item) => ({ ...item, courseName: courseIdToNameMap[item.courseId] }));
    res.status(200).json({ message: "Schedule fetched", data: result });}
    
    catch(err){
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" });}
}
module.exports = { updateLectureState, updateTutorialState, updatePracticalState, getProfessorIdByUserId, getScheduleForProfessor};