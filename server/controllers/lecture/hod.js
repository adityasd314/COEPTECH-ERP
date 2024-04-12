const { getDepartmentByHODUserId } = require('./hod/getDepartmentByHODUserId');

const {
  getAllCoursesWithProfessorsByDepartment,
} = require('./hod/getAllCoursesWithProfessorsByDepartment');


// console.log({
//   getAllCoursesWithProfessorsByDepartment,
//   getDepartmentByHODUserId,
// });

const {getAllCoursesWithProfessorsByDepartment} = require('./hod/getAllCoursesWithProfessorsByDepartment');
const { getDepartmentTimeTable } = require("./hod/getDepartmentTimeTable")
const {getStudentAverageFeedback} = require('./hod/getStudentAverageFeedback')
module.exports = {
  getDepartmentByHODUserId, getAllCoursesWithProfessorsByDepartment, getDepartmentTimeTable
, getStudentAverageFeedback
};
