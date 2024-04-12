const { eq } = require('drizzle-orm');
const db = require("../../../lib/drizzle-client");
const { users, feedback, students, courses, lectures, practicals, tutorials, professors } = require("../../../db/schema");
// lets do proper error handling
const updateTutorialState = async (req, res) => {
    try{ const { id: tutorialId, state } = req.body;
     if (!tutorialId || !state) {
         res.status(400).json({ message: "Invalid data",dataFormat: { tutorialId: "string", state: "string" }});
         return;
     }
     await db.update(tutorials).set({ state }).where(eq(tutorials.tutorialId, tutorialId));
     res.status(200).json({ message: "Tutorial state updated" });}catch(err){
         console.log(err)
         res.status(500).json({ message: "Internal Server Error" });}
 }

 module.exports = {
    updateTutorialState 
 }