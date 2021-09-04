require("dotenv").config();
const logger = require('./logger/log')(module);
const schedule = require('node-schedule');
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const rule = new schedule.RecurrenceRule();
rule.hour = 23;
// rule.second = 1; /* for testing you can uncomment this out */
rule.tz = 'Etc/UTC';

/* dummy data */
const emails = [
    "naren@thelabz.com",
    "narendrachouhan0021@gmail.com"
];

const job = schedule.scheduleJob(rule, async () => {
    for (let i = 0; i < emails.length; i++) {
        await sendMail("Motivation Thoughts", emails[i])
    }
});


const sendMail = async (title, email) => {
    return new Promise((resolve, reject) => {
        console.log("process.env.DEV_MAIL_API_KEY", process.env.DEV_MAIL_API_KEY)
        const mailgunAuth = {
            auth: {
                api_key: process.env.DEV_MAIL_API_KEY,
                domain: process.env.DEV_MAIL_DOMAIN,
            },
        };

        const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));

        const mailOptions = {
            from: process.env.DEV_FROM_EMAIL,
            to: email,
            subject: "Thoughts...",
            text: title,
        };

        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                logger.error("error sending to this email address", email)
                resolve(false);
            } else {
                logger.info("successfully email send for this address", email)
                resolve(true);
            }
        });
    });
};