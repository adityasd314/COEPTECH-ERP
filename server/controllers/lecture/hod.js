const { getDepartmentByHODUserId } = require('./hod/getDepartmentByHODUserId');

const {
  getAllCoursesWithProfessorsByDepartment,
} = require('./hod/getAllCoursesWithProfessorsByDepartment');

// console.log({
//   getAllCoursesWithProfessorsByDepartment,
//   getDepartmentByHODUserId,
// });

module.exports = {
  getDepartmentByHODUserId,
  getAllCoursesWithProfessorsByDepartment,
};
