const { eq } = require('drizzle-orm');
const DrizzleClient = require("../lib/drizzle-client");
const {  users, students} = require("../db/schema");

const temp = async (req, res) => {
  try {

    const bookingToUpdate =  (await DrizzleClient.select().from(users))[0];
    
    
    return res
      .status(200)
      .json({ success: true,bookingToUpdate, message: 'Booking granted successfully.' });
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


module.exports = {
 temp
};
