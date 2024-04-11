const { eq, lte, gte, ne, desc } = require('drizzle-orm');
const DrizzleClient = require("../../lib/drizzle-client")

const {venues, bookings} = require("../../db/schema");

const { use } = require("../../routes/venue");
const { parse } = require('path');

const getAllVenues = async(req, res) => {
  try{
    const allVenues=(await DrizzleClient.select().from(venues))
    res.status(200).json({ allVenues });
  }catch(error){
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

const getVenueById = async(req, res) => {
  try {
    const venue_id  = req.params['venue_id'];
    const venue = await DrizzleClient.select().from(venues).where(eq(venues.venueId, venue_id));
  
    if (venue.length === 0) {
      res.status(404).json({ error: "Venue not found" });
    } else {
      res.status(200).json({ venue });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
  
};

const addVenue = async(req, res) => {
  const {venueName, description, permissionFacultyId, location, capacity } = req.body;
  if (!venueName ){
    res.status(400).json({ error: "All fields must be filled" });
  }
  try{
    data = {
      venueName : venueName,
    }
    if(description){
      data.description = description;
    }
    if(permissionFacultyId){
      data.permissionFacultyId =permissionFacultyId;
    }
    if(location){
      data.location=location;
    }
    if(capacity){
      data.capacity=capacity;
    }
    const venue = (await DrizzleClient.insert(venues).values(data).returning({ venueId:venues.venueId, venueName:venues.venueName, description:venues.description, permissionFacultyId: venues.permissionFacultyId}));

    res.status(200).json({ venue });
  }catch{
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateVenue = async (req, res) => {
  try {
    const { venue_id } = req.params;
    console.log(parseInt(venue_id));
    const updatedVenue = req.body; 
    console.log(updatedVenue);
    delete updatedVenue.venue_id;
    await DrizzleClient.update(venues).set(updatedVenue).where(eq(venues.venueId, venue_id));

    res.status(200).json({ venue_id });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteVenue = async(req, res) => {
  const {venue_id} = req.params;
  try{  
    const deleteVenue = await DrizzleClient.delete(venues).where(eq(venues.venueId, venue_id)).returning({venue_id: venues.venueId});
    res.status(200).json({deleteVenue});
  }catch(error){
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAvailableVenues = async(req, res) => {
  try {
    const { start_date } = req.body;
    const end_date = new Date(start_date);
    end_date.setDate(end_date.getDate() + 30);
    const monthlybookings = await DrizzleClient.select().from(bookings).where(eq(bookings.status, "confirmed"));
    const filteredBookings = monthlybookings.filter(booking => {
      const bookingStartTime = new Date(booking.startTime);
      const bookingEndTime = new Date(booking.endTime);
      return bookingStartTime >= start_date && bookingEndTime <= end_date;
    });
    res.status(200).json({ filteredBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
