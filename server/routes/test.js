const express = require('express');
const { getTableData } = require('../controllers/test');
// controller functions

const router = express.Router();

// login route
router.post('/test', (req, res) => {
    
    let data = {}
    res.status(200).json({ message: "Test route works", data });
});
router.post('/test2', (req, res) => {
    
    let data = {}
    
    res.status(200).json({ message: "Test route works", data });
});



module.exports = router;
