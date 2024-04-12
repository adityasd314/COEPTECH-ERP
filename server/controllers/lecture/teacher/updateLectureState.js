const { eq } = require('drizzle-orm');
const db = require("../../../lib/drizzle-client");
const { users, feedback, students, courses, lectures, practicals, tutorials, professors } = require("../../../db/schema");
// lets do proper error handling

const updateLectureState = async (req, res) => {
    try{
    const { id: lectureId, state } = req.body;
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

module.exports = {
    updateLectureState 
}