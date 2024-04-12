var axios = require("axios").default; 
const { JSDOM } = require('jsdom');
const fs = require('fs');
const { eq } = require('drizzle-orm');
const DrizzleClient = require("../../lib/drizzle-client");
const { venues, bookings, professors } = require("../../db/schema");

const dom = new JSDOM('<!DOCTYPE html>');
const document = dom.window.document;

const getBookingById = async(BookingId) => {
    try{
      const booking = await DrizzleClient.select().from(bookings).where(eq(bookings.bookingId, BookingId))
      return booking
    }catch(error){
      console.log(error);
    }
}

const getProfessorName = async(ProfessorId) => {
    try{
        const professor = await(DrizzleClient.select().from(professors).where(eq(professors.professorId, ProfessorId)));
        return professor;
    }catch(error){
        console.log(error);
    }
}

const getFacultyName = async(venue_id) => {
    try{
        const venue = await (DrizzleClient.select().from(venues).where(eq(venues.venueId, venue_id)));
        const facId = venue[0].permissionFacultyId;
        const faculty =await  (DrizzleClient.select().from (professors).where(eq(professors.professorId, facId)));
        return faculty;
    }catch(error){
        console.log(error);
    }
}


const getDocument = async(req, res) => {

    const {booking_id} = req.body;

    const bookingdata = await getBookingById(booking_id);
    console.log(bookingdata);
    const professorData = await getProfessorName(bookingdata[0].professorId);
    console.log(professorData);
    const facultyData = await getFacultyName(bookingdata[0].venueId);
    console.log(facultyData);
    const currentDate = new Date();
    const htmlContent = fs.readFileSync('./controllers/documents/template2.html', 'utf8');


    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    div
    const textField1 = div.querySelector('.content strong');
    if (textField1) {
        textField1.textContent =  currentDate;
    }
    const textField2 = div.querySelector('.reason');
    if (textField2) {
        textField2.textContent =  bookingdata[0].purpose;
    }
    const textField3 = div.querySelector('.proposedBy');
    if (textField3) {
        textField3.textContent =  professorData[0].name;
    }
    const textField4 = div.querySelector('.approvedBy');
    if (textField4) {
        textField4.textContent =  facultyData[0].name;
    }
    const textField5 = div.querySelector('.signature-box:nth-child(1) img');
    if (textField5) {
        textField5.src = "https://rvvoznnspleurqmmeczr.supabase.co/storage/v1/object/public/signatures/siganture.png";
    }const textField6 = div.querySelector('.signature-box:nth-child(2) img');
    if (textField6) {
        textField6.src =  "https://rvvoznnspleurqmmeczr.supabase.co/storage/v1/object/public/signatures/siganture.png";
    }
    const modifiedHtmlContent = div.innerHTML;

    var options = {
        method: 'POST',
        url: 'https://api.docuseal.co/templates/html',
        headers: {'X-Auth-Token': '8gV9scT3s4iPTkNgVThdUxC2jEkQzVvYsfeB6pxutwW', 'content-type': 'application/json'},
        data: {
        html: modifiedHtmlContent,
        name: 'Template'
        }
    };

    axios.request(options).then(function (response) {
        const data = response.data;
        res.status(200).json({ data })
      }).catch(function (error) {
        console.error(error);
      });
}

module.exports = {
    getDocument
}
