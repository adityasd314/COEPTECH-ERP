const { eq } = require('drizzle-orm');
const db = require("../../../lib/drizzle-client");
const { users, feedback, students, courses, lectures, practicals, tutorials, professors } = require("../../../db/schema");
// lets do proper error handling
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
module.exports = {
    getScheduleForProfessor
};