const express = require('express');
const {
  getAllLecturesLabsPracticals,
} = require('../controllers/lecture/lecture');
const {
  updateLectureState,
  updateTutorialState,
  updatePracticalState,
  getProfessorIdByUserId,
  getScheduleForProfessor,
  updateState,
} = require('../controllers/lecture/teacher');
const { submitFeedback } = require('../controllers/lecture/student');
const {
  getDepartmentByHODUserId,
  getAllCoursesWithProfessorsByDepartment,
  getDepartmentTimeTable
} = require('../controllers/lecture/hod');
console.log({
  getAllCoursesWithProfessorsByDepartment,
  getDepartmentByHODUserId,
});

const router = express.Router();

// Admin Only Routes

router.post('/getAllLecturesLabsPracticals', getAllLecturesLabsPracticals);
router.post('/teacher/updateState', updateState);
router.post('/teacher/updateLectureState', updateLectureState);
router.post('/teacher/updateTutorialState', updateTutorialState);
router.post('/teacher/updateLabState', updatePracticalState);
router.post('/teacher/getProfessorIdByUserId', getProfessorIdByUserId);
router.post('/teacher/getScheduleForProfessor', getScheduleForProfessor);

// studemt
router.post('/student/submitFeedback', submitFeedback);

// hod
router.post('/hod/getDepartmentByHODUserId', getDepartmentByHODUserId);
router.post('/hod/getDepartmentTimeTable', getDepartmentTimeTable);
router.post(
  '/hod/getAllCoursesWithProfessorsByDepartment',
  getAllCoursesWithProfessorsByDepartment
);
router.post(
  '/hod/getAllCoursesWithProfessorsByDepartment',
  getAllCoursesWithProfessorsByDepartment
);

module.exports = router;
