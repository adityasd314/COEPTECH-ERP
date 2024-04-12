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
console.log({getAllCoursesWithProfessorsByDepartment, getDepartmentByHODUserId})
module.exports = {
  getDepartmentByHODUserId, getAllCoursesWithProfessorsByDepartment, getDepartmentTimeTable
};
