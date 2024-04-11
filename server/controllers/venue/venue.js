const { eq, DrizzleError } = require('drizzle-orm');
const DrizzleClient = require('../../lib/drizzle-client');
const { venues, bookings } = require('../../db/schema');
const { use } = require('../../routes/venue');
const { parse } = require('path');

const getAllVenues = async (req, res) => {
  try {
    const allVenues = await DrizzleClient.select().from(venues);
    res.status(200).json({ allVenues });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
};

const getVenueById = async (req, res) => {
  try {
    const venue_id = req.params['venue_id'];
    const venue = await DrizzleClient.select()
      .from(venues)
      .where(eq(venues.venueId, venue_id));

    if (venue.length === 0) {
      res.status(404).json({ error: 'Venue not found' });
    } else {
      res.status(200).json({ venue });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addVenue = async (req, res) => {
  const { venueName, description, permissionFacultyId, location, capacity } =
    req.body;
  if (!venueName) {
    res.status(400).json({ error: 'All fields must be filled' });
  }
  try {
    data = {
      venueName: venueName,
    };
    if (description) {
      data.description = description;
    }
    if (permissionFacultyId) {
      data.permissionFacultyId = permissionFacultyId;
    }
    if (location) {
      data.location = location;
    }
    if (capacity) {
      data.capacity = capacity;
    }
    const venue = await DrizzleClient.insert(venues).values(data).returning({
      venueId: venues.venueId,
      venueName: venues.venueName,
      description: venues.description,
      permissionFacultyId: venues.permissionFacultyId,
    });

    res.status(200).json({ venue });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateVenue = async (req, res) => {
  try {
    const { venue_id } = req.params;
    const updatedVenue = req.body;
    delete updatedVenue.venue_id;
    await DrizzleClient.update(venues)
      .set(updatedVenue)
      .where(eq(venues.venueId, venue_id));
    res.status(200).json({ venue_id });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteVenue = async (req, res) => {
  const venue_id = req.params['venue_id'];
  console.log(venue_id);
  try {
    const deleteVenue = await DrizzleClient.delete(venues)
      .where(eq(venues.venueId, venue_id))
      .returning({ venue_id: venues.venueId });
    res.status(200).json({ deleteVenue });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAvailableVenues = async (req, res) => {
  try {
    const { start_time, end_time, booking_date, venue_id } = req.body;
    console.log(req.body);
    const bookingsforVenue = await DrizzleClient.select()
      .from(bookings)
      .where(eq(bookings.venueId, venue_id));

    const SameDateBookings = bookingsforVenue.filter((booking) => {
      return booking.bookingDate === booking_date;
    });

    const SameDateConfirmedBookings = bookingsforVenue.filter((booking) => {
      return booking.status === 'confirmed';
    });

    const filteredBookings = SameDateBookings.filter((booking) => {

      const bookingDate = booking.bookingDate;
      const bookingStartTime = parseDateTime(bookingDate, booking.startTime);
      const bookingEndTime = parseDateTime(bookingDate, booking.endTime);
    

      const queryStartTime = parseDateTime(booking_date, start_time);
      const queryEndTime = parseDateTime(booking_date, end_time);
    
      console.log(bookingStartTime, bookingEndTime, queryStartTime, queryEndTime);
    
      return (
        (bookingStartTime >= queryStartTime && bookingStartTime <= queryEndTime) ||
        (bookingEndTime >= queryStartTime && bookingEndTime <= queryEndTime) ||
        (bookingStartTime <= queryStartTime && bookingEndTime >= queryEndTime)
      );
    });
    
    function parseDateTime(dateString, timeString) {
      var dateComponents = dateString.split("-");
      var year = parseInt(dateComponents[0]);
      var monthIndex = parseInt(dateComponents[1]) - 1; 
      var day = parseInt(dateComponents[2]);
    
      
      var timeComponents = timeString.split(":");
      var hours = parseInt(timeComponents[0]);
      var minutes = parseInt(timeComponents[1]);

      return new Date(year, monthIndex, day, hours, minutes, 0, 0);
    }
    

    console.log(filteredBookings);

    const bookedVenueIds = filteredBookings.map((booking) => booking.venueId);

    const allVenues = await DrizzleClient.select().from(venues);
    const availableVenues = allVenues.filter(
      (venue) => !bookedVenueIds.includes(venue.venueId)
    );

    console.log(availableVenues);
    const availableVenueIds = availableVenues.map((venue) => venue.venueId);

    res.status(200).json({ availableVenueIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllVenues,
  getVenueById,
  addVenue,
  updateVenue,
  deleteVenue,
  getAvailableVenues,
};
