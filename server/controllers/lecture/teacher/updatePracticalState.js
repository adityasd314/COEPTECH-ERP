const { eq } = require('drizzle-orm');
const db = require("../../../lib/drizzle-client");
const { users, feedback, students, courses, lectures, practicals, tutorials, professors } = require("../../../db/schema");
// lets do proper error handling
const updatePracticalState = async (req, res) => {
    try{  const { id: practicalId, state } = req.body;
      if (!practicalId || !state) {
          res.status(400).json({ message: "Invalid data",dataFormat: { practicalId: "string", state: "string" }});
          return;
      }
      await db.update(practicals).set({ state }).where(eq(practicals.practicalId, practicalId));
      res.status(200).json({ message: "Practical state updated" });}catch(err){
          console.log(err)
          res.status(500).json({ message: "Internal Server Error" });}
  }
 module.exports = {
    updatePracticalState
 }