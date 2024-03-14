const fs = require('fs').promises; // Using promises version of fs for async operations
const { assign } = require('nodemailer/lib/shared');
const User = require('../../model/UserSchema');
const json2csv = require('json2csv').parse;

exports.exportCSV = async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);


    if (isNaN(month) || isNaN(year) || month < 1 || month > 12 || year < 1900 || year > 2100) {
      throw new Error('Invalid month or year');
    }

    // Retrieve user data with attendance records
    const userData = await User.find();

    // Transform userData to include only necessary fields
    const transformedData = userData.map(user => {
      // Check if the user has the role "admin"
      if (user.role === "admin") {
        return null; // Skip this user
      }
    
      const assigned = user.assignedAccumulatedLeaves.find(entry => {
        const entryDate = new Date(entry.date);
          entryDate.setUTCHours(0, 0, 0, 0);
          return entryDate.getUTCMonth() === month - 1 && entryDate.getUTCFullYear() === year;
        });
      const transformedUser = {
        name: user.info.name,
        accumulatedLeave: user.accumulatedLeaves,
        attendance: user.attendance.filter(entry => {
          const entryDate = new Date(entry.date);
          entryDate.setUTCHours(0, 0, 0, 0);
          return entryDate.getUTCMonth() === month - 1 && entryDate.getUTCFullYear() === year;
        }),
        allotedLeaves:assigned?assigned.value:null,
        PrevaccumulatedLeave:assigned?user.accumulatedLeaves-assigned.value:user.accumulatedLeaves,
      };
      return transformedUser;
    }).filter(user => user !== null); // Remove the null entries for admin users
    
    

    // Extract unique dates from the filtered data for the specific month and year
    const uniqueDates = [...new Set(transformedData.flatMap(user => user.attendance.map(entry => {
      const entryDate = new Date(entry.date);
      return (entryDate.getMonth() === month - 1 && entryDate.getFullYear() === year) ? entryDate.toISOString().split('T')[0] : null;
    }).filter(date => date)))];

    // Prepare CSV fields
    const fields = ['Name', 'AccumulatedLeaves','AllotedAccumulatedLeaves','PreviousMonthAccumulatedLeaves', ...uniqueDates];

    // Prepare CSV data
    const csvData = transformedData.map(user => {
      const attendanceData = {
        Name: user.name,
        AccumulatedLeaves: user.accumulatedLeave,
        AllotedAccumulatedLeaves: user.allotedLeaves, // Corrected property name
        PreviousMonthAccumulatedLeaves: user.PrevaccumulatedLeave, // Corrected property name
      };
    
      uniqueDates.forEach(date => {
        const entry = user.attendance.find(a => {
          const entryDate = new Date(a.date);
          return entryDate.getMonth() === month - 1 && entryDate.getFullYear() === year && entryDate.toISOString().split('T')[0] === date;
        });
        attendanceData[date] = entry ? entry.value : '';
      });
    
      console.log("attendance data>>", attendanceData);
      return attendanceData;
    });
    

    // Convert data to CSV format
    const csv = json2csv(csvData, { fields });

    // Set response headers for CSV download
    res.setHeader(
      "Content-disposition",
      `attachment; filename=Report_${month}_${year}.csv`
    );
    res.set("Content-Type", "text/csv");

    // Send CSV data in response
    res.send(csv);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
}
