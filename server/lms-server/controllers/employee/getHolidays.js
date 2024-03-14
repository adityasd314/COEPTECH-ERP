const Holiday = require("../../model/HolidaySchema");

exports.getHolidays = async (req, res) => {

  try {
      const holiday = await Holiday.find();
      return res.status(200).json(holiday);
  } catch (error) {
    console.error("Error fetching Holidays:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
