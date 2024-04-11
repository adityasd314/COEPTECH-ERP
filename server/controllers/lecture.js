const { eq, lt, gte, ne } = require('drizzle-orm');

const DrizzleClient = require("../lib/drizzle-client")
const client = require("../lib/prisma-client");
const hashPassword = require("../lib/hash_pass");
const compareHash = require("../lib/compare_hash");
const {lectures, tutorials,practicals, professors,courses, feedback,observationChecklist,headsOfDepartment,performanceMetrics, students} = require("../db/schema")
const getAllLectureLabTutorials = (req, res)=>{
    const {user_id} = req.body;
    // get department of user
    // get lecs tuts and pracs for that department
    // get department_id from students
    const department_id = DrizzleClient.select().from(students).where(eq(students.user_id, user_id))[0];
    console
    const lecs = DrizzleClient.select().from(lectures).where(eq(lectures.departmentId, user_id));
    const tuts = DrizzleClient.select().from(tutorials).where(eq(tutorials.departmentId, user_id));
    const pracs = DrizzleClient.select().from(practicals).where(eq(practicals.departmentId, user_id));


    res.status(200).json({mes:"adsf"});
}
module.exports = { getAllLectureLabTutorials };
