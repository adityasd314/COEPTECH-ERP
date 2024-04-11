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
module.exports = { updateLectureState, updateTutorialState, updatePracticalState };