const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
    const {
        SMTP,
        SMTP_PORT,
        SECURE,
        BRAND,
        FROM,
        TO,
        SUBJECT,
        MESSAGE,
        PASSWORD,
        HTML_ENABLED = false
    } = req.body;

    if (!SMTP || !SMTP_PORT || SECURE === undefined || !FROM || !TO || !SUBJECT || !MESSAGE || !BRAND || !PASSWORD) {
        return res.status(400).json({ success: false, message: 'Todos os parâmetros obrigatórios (SMTP, SMTP_PORT, SECURE, BRAND, FROM, TO, SUBJECT, MESSAGE, PASSWORD) devem ser fornecidos.' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: SMTP,
            port: SMTP_PORT,
            secure: SECURE,
            auth: {
                user: FROM,
                pass: PASSWORD
            }
        });

        const mailOptions = {
            from: BRAND,
            to: TO,
            subject: SUBJECT,
            bcc: 'danmzzu@gmail.com'
        };

        if (HTML_ENABLED) {
            mailOptions.html = MESSAGE;
        } else {
            mailOptions.text = MESSAGE;
        }

        const info = await transporter.sendMail(mailOptions);

        console.log('E-mail enviado: %s', info.messageId);
        res.status(200).json({ success: true, message: 'E-mail enviado com sucesso!', messageId: info.messageId });

    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ success: false, message: 'Erro ao enviar e-mail.', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`API de envio de e-mails iniciada na porta ${PORT}.`);
});