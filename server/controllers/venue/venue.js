const { eq, lte, gte, ne } = require('drizzle-orm');
const DrizzleClient = require("../lib/drizzle-client")

const {venues, bookings} = require("../db/schema");
const { bookings } = require('../../db/schema');

const getAllVenues = async() => {
  try{
    const allVenues=(await DrizzleClient.select().from(venues))
    return res.status(200).json({ allVenues });
  }catch(error){
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getVenueById = async(req, res) => {
  try{
    const { venue_id } = req.body;
    const venue = (await DrizzleClient.select().from(venues).where(eq(venue.venueId, venue_id)) )
    return res.status(200).json({ venue });
  }catch(error){
    return res.status(500).json({ error: "Internal Server Error" });
  }
  
};

const addVenue = () => {
  return 0;
};

const updateVenue = () => {
  return 0;
};

const deleteVenue = () => {
  return 0;
};

const getAvailableVenues = async(req, res) => {
  try {
    const { start_date } = req.body;

    // Calculate end date by adding 30 days to start date
    const end_date = new Date(start_date);
    end_date.setDate(end_date.getDate() + 30);

    // Assuming you're using some sort of ORM or query builder like DrizzleClient
    const monthlybookings = await DrizzleClient.select().from(bookings).where(gte(bookings.start_date, start_date)).andWhere(lte(bookings.end_date, end_date)).andWhere(eq(bookings.status,'confirmed'));

    // Do something with the bookings, perhaps return them or process them further
    return res.status(200).json({ monthlybookings });
  } catch (error) {
    // Handle errors appropriately
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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
