const axios = require("axios").default; 
const { JSDOM } = require('jsdom');
const fs = require('fs');
const { eq } = require('drizzle-orm');
const DrizzleClient = require("../../lib/drizzle-client");
const { venues, bookings, professors, reports } = require("../../db/schema");

const dom = new JSDOM('<!DOCTYPE html>');
const document = dom.window.document;

const getDocument = async (req, res) => {
    const { booking_id, user_id } = req.body;

    try {
        // Fetch booking data from the database
        const bookingdata = await DrizzleClient.select().from(bookings).where(eq(bookings.bookingId, booking_id)).limit(1);
        const venueData = await DrizzleClient.select().from(venues).where(eq(venues.venueId, bookingdata[0].venueId)).limit(1);
        const professorData = await DrizzleClient.select().from(professors).where(eq(professors.professorId, bookingdata[0].professorId)).limit(1);
        const facultyData = await DrizzleClient.select().from(professors).where(eq(professors.professorId, venueData[0].permissionFacultyId)).limit(1);
        
        // Read the HTML template file
        const htmlContent = fs.readFileSync('./controllers/documents/template2.html', 'utf8');
        
        // Parse the HTML content using JSDOM
        const div = document.createElement('div');
        div.innerHTML = htmlContent;

        // Fill in the placeholders with actual data
        const currentDate = new Date();
        div.querySelector('.content strong').textContent = currentDate;
        div.querySelector('.reason').textContent = bookingdata[0].purpose;
        div.querySelector('.proposedBy').textContent = professorData[0].name;
        div.querySelector('.approvedBy').textContent = facultyData[0].name;
        div.querySelector('.signature-box:nth-child(1) img').src = "https://rvvoznnspleurqmmeczr.supabase.co/storage/v1/object/public/signatures/siganture.png";
        div.querySelector('.signature-box:nth-child(2) img').src = "https://rvvoznnspleurqmmeczr.supabase.co/storage/v1/object/public/signatures/siganture.png";
        div.querySelector('.venue').textContent = venueData[0].venueName;
        div.querySelector('.date').textContent = bookingdata[0].bookingDate;
        div.querySelector('.start').textContent = bookingdata[0].startTime;
        div.querySelector('.end').textContent = bookingdata[0].endTime;

        // Get the modified HTML content
        const modifiedHtmlContent = div.innerHTML;

        // Make API request to DocuSeal
        const options = {
            method: 'POST',
            url: 'https://api.docuseal.co/templates/html',
            headers: { 'X-Auth-Token': '8gV9scT3s4iPTkNgVThdUxC2jEkQzVvYsfeB6pxutwW', 'content-type': 'application/json' },
            data: {
                html: modifiedHtmlContent,
                name: 'Template'
            }
        };

        // Send request and handle response
        const response = await axios.request(options);
        const resp = response.data;

        // Save the report data to the database or perform any other necessary actions
        // const data = {
        //     reportName: 'Permission Letter',
        //     reportDate: currentDate,
        //     reportType: 'letter',
        //     generatedBy: user_id,
        //     cloudinaryLink: resp.documents[0].url,
        // };
        // await DrizzleClient.insert(reports).values(data);

        res.status(200).json({ resp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while generating the document" });
    }
};

module.exports = {
    getDocument
};
