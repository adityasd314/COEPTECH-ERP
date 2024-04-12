const { eq, and} = require('drizzle-orm');
const db = require("../../../lib/drizzle-client");
const { users, feedback, students, courses, lectures, practicals, tutorials, professors, dayOfWeekEnum, timetable } = require("../../../db/schema");
// lets do proper error handling
const dayWeeksEnum = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
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
      courseIdToNameMap[course.courseId] = course;
    }
    
    const getWeekDayName = new Date().toLocaleString('en-us', { weekday: 'long' });
    console.log({getWeekDayName})
    let professorLecturesTimetableByDay = [];
    if(dayWeeksEnum.includes(getWeekDayName))
    professorLecturesTimetableByDay = await db.select().from(timetable).where(and(eq(timetable.dayOfWeek, getWeekDayName),eq(timetable.professorId, professorId)));
    
    const lecturesData = (await db.select().from(lectures).where(eq(lectures.professorId, professorId))).map((lecture) => ({ ...lecture, type: "LECTURE",id:lecture.lectureId }));;
    const tutorialsData = (await db.select().from(tutorials).where(eq(tutorials.professorId, professorId))).map((tutorial) => ({ ...tutorial, type: "TUTORIAL",id:tutorial.tutorialId }));;
    const practicalsData = (await db.select().from(practicals).where(eq(practicals.professorId, professorId))).map((practical) => ({ ...practical, type: "LAB", id:practical.practicalId}));
    const result = [...lecturesData, ...tutorialsData, ...practicalsData, ...professorLecturesTimetableByDay.map((x)=>({...x, "dateTime":x.startTime}))].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)).map((item) => ({ ...item, courseName: courseIdToNameMap[item.courseId].courseName, courseCode: courseIdToNameMap[item.courseId].courseCode}));
    res.status(200).json({ message: "Schedule fetched", data: result });}
    
    catch(err){
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" });}
}
module.exports = {
    getScheduleForProfessor
};