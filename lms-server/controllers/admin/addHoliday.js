const Holiday = require("../../model/HolidaySchema");

exports.addHoliday = async (req, res) => {
    const { on, note } = req.body;
    console.log("Received:", req.body);
    try {
        const holiday = {
            date: new Date(on),
            type: note,
            note: note
        };
        console.log("Holiday >>> : ", holiday);
        const savedHoliday = await Holiday.create(holiday);
        console.log("Holiday added : ", savedHoliday);
        res.status(201).json({ savedHoliday });
    } catch (error) {
        console.error('Error adding holiday:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
