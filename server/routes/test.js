const {users} = require('../db/schema')
const db = require('../lib/drizzle-client')
// main()
const express = require('express');
const { getTableData } = require('../controllers/test');
// controller functions

const router = express.Router();

// login route
router.post('/test', (req, res) => {
    
    let data = {}
    res.status(200).json({ message: "Test route works", data });
});
router.post('/test2', async(req, res) => {
    
    const result = await db.select().from(users);
    console.log(result)
    
    res.status(200).json({ message: "Test route works", result });
});
router.post('/getTableData', getTableData);



module.exports = router;
