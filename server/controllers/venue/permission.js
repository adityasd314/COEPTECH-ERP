const { eq, lte, gte} = require('drizzle-orm');
const DrizzleClient = require("../../lib/drizzle-client")
const {bookings} = require("../../db/schema");
const { use } = require("../../routes/venue");

const getSchedule = async(req, res) => {
    try{
        const { venue_id } = req.body;
        const currentDate = new Date();
        const endDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days later
        const Schedule = {};
        const bookingsforVenue = await DrizzleClient.select().from(bookings).where(eq(bookings.venueId, venue_id));
        const bookingsforVenueinMonth = bookingsforVenue.filter(booking => {
            const bookingDate = new Date(booking.bookingDate);
            return bookingDate >= currentDate && bookingDate <= endDate;
        });
        const bookingsforVenueinMonthConfirmed = bookingsforVenueinMonth.filter(booking => {
            return booking.status == 'confirmed';
        });
        console.log("bokingsforVenueinMonthConfirmed:",bookingsforVenueinMonthConfirmed);
        for (let i = 0; i < 30; i++) {
            const date = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000);
            Schedule[date.toISOString().slice(0, 10)] = {
                availability: true,
                professorId: null
            };
        }

        bookingsforVenueinMonthConfirmed.forEach(booking => {
            const bookingDate = new Date(booking.bookingDate);
            const dateKey = bookingDate.toISOString().slice(0, 10);
            if (Schedule[dateKey]) {
                Schedule[dateKey].availability = false;
                Schedule[dateKey].professorId = booking.professorId;
            }
        });
        res.status(200).json({ Schedule });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getSchedule
}