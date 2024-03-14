const express = require("express");
const router = express.Router();
router.use(express.json());

const {applyLeave} = require("../controllers/employee/applyLeave");
const {getEmployeeData} = require("../controllers/employee/getEmployeeData");
const {getLeavesByEmployeeId} = require("../controllers/employee/getLeavesByEmployeeId")
const {markAttendance} = require("../controllers/employee/markAttendance")
const {cancelLeave} = require("../controllers/employee/cancelLeave")
const {getHolidays} = require("../controllers/employee/getHolidays");

router.post("/apply", applyLeave);
router.get("/holiday", getHolidays);
router.post("/mark", markAttendance);
router.post("/cancel", cancelLeave);
router.post("/getEmployeeData", getEmployeeData);
router.post("/getLeavesByEmployeeId", getLeavesByEmployeeId);

module.exports = router;
