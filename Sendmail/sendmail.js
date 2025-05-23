const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;
const EMAIL_USER = 'contato@l009.com.br';
const EMAIL_PASS = process.env.EMAIL_PASS;
const SMTP_HOST = '1234';
const SMTP_PORT = 465;
const SMTP_SECURE = true;

app.use(cors());
app.use(express.json());

app.post('/sendmail', async (req, res) => {
    const {
        Brand,
        To,
        Subject,
        Message,
        HTML_ENABLED = false
    } = req.body;

    if (!Brand || !To || !Subject || !Message) {
        return res.status(400).json({ success: false, message: 'Todos os parâmetros (Brand, To, Subject, Message) são obrigatórios.' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_SECURE,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        });

        const mailOptions = {
            from: Brand,
            to: To,
            subject: Subject,
            bcc: `${To}, contato@l009.com.br`
        };

        if (HTML_ENABLED) {
            mailOptions.html = Message;
        } else {
            mailOptions.text = Message;
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
    console.log(`Servidor de envio de e-mails rodando na porta ${PORT}.`);
});