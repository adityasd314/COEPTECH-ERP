const express = require('express');
const {
  getAllVenues,
  getVenueById,
  addVenue,
  updateVenue,
  deleteVenue,
  getAvailableVenues,
  getAllAvailableVenues,
} = require('../controllers/venue/venue');

const {
  grantBooking,
  revokeBooking,
  getAllBookings,
  makeBooking,
  cancelBooking,
  getMyBookings,
  editBooking
} = require('../controllers/venue/booking');

const {storeReport } = require('../controllers/venue/report');
const { getSchedule } = require('../controllers/venue/permission');

const router = express.Router();

// Admin Only Routes

router.post('/addVenues', addVenue);       
router.put('/editVenues/:venue_id', updateVenue);     
router.delete('/deleteVenues/:venue_id', deleteVenue);

router.post('/booking', getAllBookings);
router.post('/booking/grant', grantBooking);
router.post('/booking/revoke', revokeBooking);

router.post('/reports', storeReport);

// User Routes

router.get('/getVenues', getAllVenues);     
router.get('/getVenueById/:venue_id', getVenueById); 
router.post('/availableVenues', getAvailableVenues);  
router.post('/getAllAvailableVenues', getAllAvailableVenues);

router.post('/booking/make', makeBooking);
router.post('/booking/edit', editBooking);
router.post('/booking/cancel', cancelBooking);
router.post('/booking/myBookings', getMyBookings);

router.get('/getSchedule', getSchedule);


module.exports = router;
