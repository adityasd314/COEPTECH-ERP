const express = require('express')

const { loginUser, loginWithToken } = require('../controllers/user/user')

const router = express.Router()

router.post('/login', loginUser);
router.post('/loginToken', loginWithToken)


module.exports = router
