const express = require('express');
const {
  getAllLecturesLabsPracticals , updateLectureState
  , updateTutorialState
  , updatePracticalState
  ,submitFeedback

} = require('../controllers/lecture');




const router = express.Router();

// Admin Only Routes

router.post('/getAllLecturesLabsPracticals', getAllLecturesLabsPracticals);
router.post('/updateLectureState', updateLectureState);
router.post('/updateTutorialState', updateTutorialState);
router.post('/updatePracticalState', updatePracticalState);
router.post('/submitFeedback', submitFeedback);


module.exports = router;
