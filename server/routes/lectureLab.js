const express = require('express');
const {
  getAllLecturesLabsPracticals
} = require('../controllers/lecture');




const router = express.Router();

// Admin Only Routes

router.post('/getAllLecturesLabsPracticals', getAllLecturesLabsPracticals);


module.exports = router;
