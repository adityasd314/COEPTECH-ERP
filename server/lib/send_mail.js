"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path")

// async..await is not allowed in global scope, must use a wrapper

async function sendMail({ subject, receivers, text, htmlBody, files }) {
    // send mail with defined transport object
    const options = {
        from: {
            name: "Eternal",
            address: process.env.USER
        }, // sender address
        to: receivers, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: htmlBody, // html body
        // attachments: [
        //     {
        //         filename: "test.pdf",
        //         path: path.join(__dirname, 'test.pdf'),
        //         contentType: "application/pdf"
        //     }
        // ]
        attachments: files
    };
    
    const transporter = nodemailer.createTransport({
        service: "gmail.com",
        host: "smtp.gmail.com",
        port: 587,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: "eternalstudy30112004@gmail.com",
            pass: "lujtodhdewuscxlz",
        },
    });
    // console.log( process.env.USER,process.env.APP_PASSWORD )
    const info = await transporter.sendMail(options);
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
}
module.exports.sendMail = sendMail;