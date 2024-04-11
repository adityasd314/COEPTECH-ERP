const express = require('express');
// controller functions
const { getAllLectureLabTutorials } = require('../controllers/lecture');
const router = express.Router();

// login route
router.post('/getAllLectureLab', getAllLectureLabTutorials);

module.exports = router;
