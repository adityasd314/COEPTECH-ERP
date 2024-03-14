const express = require("express");
const router = express.Router();
router.use(express.json());

const {acceptLeave} = require("../controllers/admin/acceptLeave");
const {rejectLeave} = require("../controllers/admin/rejectLeave");
const {getAllEmployees} = require("../controllers/admin/getAllEmployees");
const {getEmployeeById} = require("../controllers/admin/getEmployeeById");
const {getAllLeaves} = require("../controllers/admin/getAllLeaves");
const {addEmployees} =  require("../controllers/admin/addEmployees");
const {getManagers} = require("../controllers/admin/getManagers");
const {deleteEmployee} = require("../controllers/admin/deleteEmployee");
const {updateEmployee} = require("../controllers/admin/updateEmployee");
const {allocateLeaves} = require("../controllers/admin/allocateLeave");
const {exportCSV} = require("../controllers/admin/exportCSV");
const {addHoliday} = require("../controllers/admin/addHoliday")
const {getTodayAttendance} = require("../controllers/admin/getTodayAttendance")//
const {getAttendancebyID} = require("../controllers/admin/getAttendancebyID")
const {getAttendancebyMY} = require("../controllers/admin/getAttendancebyMY")
router.post("/accept", acceptLeave);
router.post("/addHoliday",addHoliday)
router.get("/exportCSV",exportCSV);
router.get("/attendancebyID",getAttendancebyID);
router.get("/attendancebyMY",getAttendancebyMY);
router.get("/attendance",getTodayAttendance);
router.post("/update", updateEmployee)
router.post("/delete", deleteEmployee);
router.post("/reject", rejectLeave);
router.post("/getAllEmployees", getAllEmployees);
router.get("/getManagers", getManagers)
router.get("/getAllLeaves", getAllLeaves);
router.post("/getEmployeeById", getEmployeeById);
router.post("/addEmployees", addEmployees);
router.post("/allocateLeaves", allocateLeaves);

module.exports = router;
