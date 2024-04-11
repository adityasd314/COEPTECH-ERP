const express = require('express');
const {
  temp
} = require('../controllers/lecture');




const router = express.Router();

// Admin Only Routes

router.post('/temp', temp);


module.exports = router;
