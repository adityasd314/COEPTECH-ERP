const express = require('express');
const {
  getAllVenues,
  getVenueById,
  addVenue,
  updateVenue,
  deleteVenue,
  getAvailableVenues,
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

const { generateReport } = require('../controllers/venue/report');

const router = express.Router();

// Admin Only Routes

router.post('/addVenues', addVenue);
router.put('/editVenues/:venue_id', updateVenue);
router.delete('/deleteVenues/:venue_id', deleteVenue);

router.get('/booking', getAllBookings);
router.post('/booking/grant', grantBooking);
router.post('/booking/revoke', revokeBooking);

router.post('/reports', generateReport);

// User Routes

router.get('/getVenues', getAllVenues);
router.get('/getVenueById/:venue_id', getVenueById);
router.get('/availableVenues', getAvailableVenues);

router.post('/booking/make', makeBooking);
router.post('/booking/edit', editBooking);
router.post('/booking/cancel', cancelBooking);
router.post('/booking/myBookings', getMyBookings);

module.exports = router;
