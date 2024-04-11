const express = require('express');
const {
  getAllLecturesLabsPracticals 

} = require('../controllers/lecture/lecture');
const {
  updateLectureState,
  updateTutorialState,
  updatePracticalState,
} = require('../controllers/lecture/teacher');
const { submitFeedback } = require('../controllers/lecture/student');




const router = express.Router();

// Admin Only Routes

router.post('/getAllLecturesLabsPracticals', getAllLecturesLabsPracticals);
router.post('/teacher/updateLectureState', updateLectureState);
router.post('/teacher/updateTutorialState', updateTutorialState);
router.post('/teacher/updateLabState', updatePracticalState);
router.post('/student/submitFeedback', submitFeedback);


module.exports = router;
