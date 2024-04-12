const { eq } = require('drizzle-orm');
const db = require("../../../lib/drizzle-client");
const { users, feedback, students, courses, lectures, practicals, tutorials, professors } = require("../../../db/schema");
// lets do proper error handling
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
module.exports = {
    getProfessorIdByUserId
};