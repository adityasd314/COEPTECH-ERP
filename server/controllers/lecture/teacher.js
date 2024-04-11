const { eq } = require('drizzle-orm');
const db = require("../lib/drizzle-client");
const { users, feedback, students, courses, lectures, practicals, tutorials, professors } = require("../db/schema");


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
module.exports = { updateLectureState, updateTutorialState, updatePracticalState };