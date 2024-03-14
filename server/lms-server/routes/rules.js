const express = require("express");
const router = express.Router();
router.use(express.json());

const {addRules} = require("../controllers/rule/addRules");
const {getRules} = require("../controllers/rule/getRules");
const {editRules} = require("../controllers/rule/editRules");

router.post("/add", addRules);
router.post("/edit", editRules);
router.get("/get", getRules);

module.exports = router;
