"use strict";
const nodemailer = require("nodemailer");
const path = require("path")
require("dotenv").config();

async function sendMail({ subject, receivers, text, htmlBody, files }) {

    const GMAIL_ADDRESS = process.env.GMAIL_ADDRESS;
    const GMAIL_PSWD = process.env.GMAIL_PSWD;


    const options = {
        from: {
            name: "Ara Resources",
            address: GMAIL_ADDRESS
        }, // sender address
        to: receivers, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: htmlBody, // html body
        attachments: files
    };
    
    const transporter = nodemailer.createTransport({
        service: "gmail.com",
        host: "smtp.gmail.com",
        port: 587,
        secure: true,
        auth: {
            user: GMAIL_ADDRESS,
            pass: GMAIL_PSWD,
        },
    });
    const info = await transporter.sendMail(options);

}
module.exports.sendMail = sendMail;