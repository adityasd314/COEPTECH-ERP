const { eq } = require('drizzle-orm');
const DrizzleClient = require("../../lib/drizzle-client");
const { bookings, venues } = require("../../db/schema");

const grantBooking = async (req, res) => {
  try {
    const parsedBookingId = parseInt(req.body.bookingId);

    const bookingToUpdate =  (await DrizzleClient.select().from(bookings).where(eq(bookings.bookingId, parsedBookingId)))[0];

    if (!bookingToUpdate) {
      console.error('Booking not found for update!');
      return res.status(404).json({ message: 'Booking not found' });
    }

    await DrizzleClient.update(bookings)
      .set({ status: 'confirmed' })
      .where(eq(bookings.bookingId, parsedBookingId));

    DrizzleClient.update()
    return res
      .status(200)
      .json({ success: true, message: 'Booking granted successfully.' });
  } catch (error) {
    console.error('Error granting booking:', error);
    return res
      .status(500)
      .json({
        success: false,
        message: 'An error occurred while granting the booking.',
      });
  }
};


const revokeBooking = async (req, res) => {
  try {
    const parsedBookingId = parseInt(req.body.bookingId);

    const bookingToUpdate =  (await DrizzleClient.select().from(bookings).where(eq(bookings.bookingId, parsedBookingId)))[0];

    if (!bookingToUpdate) {
      console.error('Booking not found for update!');
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    await DrizzleClient.update(bookings)
      .set({ status: 'cancelled' })
      .where(eq(bookings.bookingId, parsedBookingId));

    DrizzleClient.update()
    return res
      .status(200)
      .json({ success: true, message: 'Booking revoked successfully.' });
  } catch (error) {
    console.error('Error revoking booking:', error);
    return res
      .status(500)
      .json({
        success: false,
        message: 'An error occurred while revoking the booking.',
      });
  }
};


const getAllBookings = async (req, res) => {
  try {
    const parsedFacultyId = parseInt(req.body.facultyId);
    const {isAdmin } = req.body;
    if(isAdmin){
      const allBookings = await DrizzleClient.select().from(bookings);
      return res.status(200).json({ allBookings });
    } else {
      const venueOfInterest = await DrizzleClient.select().from(venues).where(eq(venues.permissionFacultyId, parsedFacultyId));
      const venueId = venueOfInterest[0].venueId;

      const allBookings = await DrizzleClient.select().from(bookings).where(eq(bookings.venueId, venueId));
      return res.status(200).json({ allBookings });
    
    }
    
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};




const makeBooking = async (req, res) => {
  try {
    const { professorId, venueId, bookingDate, startTime, endTime, purpose } = req.body;
    

    const createdBooking = await DrizzleClient.insert(bookings).values({
      professorId : parseInt(professorId),
      venueId: parseInt(venueId) ,
      bookingDate,
      startTime,
      endTime,
      purpose,
      status: 'pending'
    }).returning();


    return res.status(200).json({ success: true, message: 'Booking made successfully.', createdBooking });
  } catch (error) {
    console.error('Error making booking:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while making the booking.' });
  }
};

const editBooking = async (req, res) => {
  try {
    const { bookingId, venueId, bookingDate, startTime, endTime, purpose } = req.body;

    const parsedBookingId = parseInt(bookingId);
    const parsedVenueId = parseInt(venueId);

    const bookingToUpdate = (await DrizzleClient.select().from(bookings).where(eq(bookings.bookingId, parsedBookingId)))[0];
    if (!bookingToUpdate) {
      console.error('Booking not found for update!');
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await DrizzleClient.update(bookings)
      .set({
        venueId: parsedVenueId,
        bookingDate,
        startTime,
        endTime,
        purpose,
        status : 'pending',
      })
      .where(eq(bookings.bookingId, parsedBookingId));

    return res.status(200).json({ success: true, message: 'Booking updated successfully.' });
  } catch (error) {
    console.error('Error editing booking:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while editing the booking.' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const parsedBookingId = parseInt(req.body.bookingId);

    const bookingToUpdate =  (await DrizzleClient.select().from(bookings).where(eq(bookings.bookingId, parsedBookingId)))[0];

    if (!bookingToUpdate) {
      console.error('Booking not found for update!');
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    await DrizzleClient.update(bookings)
      .set({ status: 'withdrawn' })
      .where(eq(bookings.bookingId, parsedBookingId));

    DrizzleClient.update()
    return res
      .status(200)
      .json({ success: true, message: 'Booking cancelled successfully.' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res
      .status(500)
      .json({
        success: false,
        message: 'An error occurred while cancelling the booking.',
      });
  }
};


const getMyBookings = async (req, res) => {
  try {

    const parsedProfessorId = parseInt(req.body.professorId);

    const myBookings = await DrizzleClient.select().from(bookings)
    .where(eq(bookings.professorId, parsedProfessorId));
  
    return res.status(200).json({ myBookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  grantBooking,
  revokeBooking,
  getAllBookings,
  makeBooking,
  cancelBooking,
  getMyBookings,
  editBooking
};
