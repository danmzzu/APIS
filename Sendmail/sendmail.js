const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: 'contato@l009.com.br',
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

app.post('/', async (req, res) => {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || (!text && !html)) {
        return res.status(400).json({ error: 'Todos os parâmetros são obrigatórios (to, subject, text or html).' });
    }

    try {
        const mailOptions = {
            from: 'contato@l009.com.br',
            to: to,
            subject: subject,
            text: text,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'E-mail enviado com sucesso!', messageId: info.messageId });
    } catch (error) {
        res.status(500).json({ error: 'Falha no envio do e-mail.', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Email API server listening on port ${port}`);
});
