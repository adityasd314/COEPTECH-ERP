const express = require('express');
// controller functions
const { loginUser, signupUser } = require('../controllers/user');
const { getNotices } = require('../controllers/notices/getNoticesByPageNumber');
const router = express.Router();

// login route
router.post('/login', loginUser);
router.post('/getNoticesByPageNumber', getNotices)
// signup route
router.post('/signup', signupUser);

module.exports = router;
