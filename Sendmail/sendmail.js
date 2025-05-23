const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

const DEFAULT_EMAIL_USER = 'contato@l009.com.br';
const DEFAULT_EMAIL_PASS = process.env.EMAIL_PASS;
const DEFAULT_SMTP_HOST = 'teste.smtp.com';
const DEFAULT_SMTP_PORT = 465;
const DEFAULT_SMTP_SECURE = true;

app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
    const {
        Brand,
        To,
        Subject,
        Message,
        html = true,
        smtp,
        port,
        email,
        password
    } = req.body;

    if (!Brand || !To || !Subject || !Message) {
        return res.status(400).json({ success: false, message: 'All parameters (Brand, To, Subject, Message) are required.' });
    }

    const currentEmailUser = email || DEFAULT_EMAIL_USER;
    const currentEmailPass = password || DEFAULT_EMAIL_PASS;
    const currentSmtpHost = smtp || DEFAULT_SMTP_HOST;
    const currentSmtpPort = port || DEFAULT_SMTP_PORT;
    const currentSmtpSecure = typeof port !== 'undefined' ? (port === 465) : DEFAULT_SMTP_SECURE;

    if (!currentEmailPass) {
        return res.status(500).json({ success: false, message: 'Server configuration error: Email password not set.' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: currentSmtpHost,
            port: currentSmtpPort,
            secure: currentSmtpSecure,
            auth: {
                user: currentEmailUser,
                pass: currentEmailPass
            }
        });

        const mailOptions = {
            from: Brand,
            to: To,
            subject: Subject,
            bcc: `${To}, contato@l009.com.br`
        };

        if (html) {
            mailOptions.html = Message;
        } else {
            mailOptions.text = Message;
        }

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent: %s', info.messageId);
        res.status(200).json({ success: true, message: 'Email sent successfully!', messageId: info.messageId });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Error sending email.', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Email sending server running on port ${PORT}.`);
});