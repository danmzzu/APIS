const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const DEFAULT_EMAIL_USER = 'contato@l009.com.br';
const DEFAULT_EMAIL_PASS = process.env.EMAIL_PASS;
const DEFAULT_SMTP_HOST = 'smtp.hostinger.com';
const DEFAULT_SMTP_PORT = 465;

app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
    const {
        To,
        Subject,
        Message,
        html,
        smtp,
        port
    } = req.body;

    if (!To || !Subject || !Message) {
        return res.status(400).json({ success: false, message: 'Todos os parâmetros (To, Subject, Message) são obrigatórios.' });
    }

    const currentEmailUser = DEFAULT_EMAIL_USER;
    const currentEmailPass = DEFAULT_EMAIL_PASS;
    const currentSmtpHost = smtp || DEFAULT_SMTP_HOST;
    const currentSmtpPort = port || DEFAULT_SMTP_PORT;

    let currentSmtpSecure;
    if (currentSmtpPort === 465) {
        currentSmtpSecure = true;
    } else if (currentSmtpPort === 587) {
        currentSmtpSecure = false;
    } else {
        currentSmtpSecure = false;
    }

    if (!currentEmailPass) {
        console.error('Erro de configuração do servidor: Senha do e-mail remetente não definida (EMAIL_PASS).');
        return res.status(500).json({ success: false, message: 'Erro de configuração do servidor: Senha do e-mail remetente não definida. Verifique suas variáveis de ambiente.' });
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
            from: currentEmailUser,
            to: To,
            subject: Subject,
            bcc: 'danmzzu@gmail.com'
        };

        if (!!html) {
            mailOptions.html = Message;
        } else {
            mailOptions.text = Message;
        }

        const info = await transporter.sendMail(mailOptions);

        console.log('Email enviado: %s', info.messageId);
        res.status(200).json({ success: true, message: 'Email enviado com sucesso!', messageId: info.messageId });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ success: false, message: 'Erro ao enviar email. Por favor, tente novamente mais tarde.', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de envio de e-mails rodando na porta ${PORT}.`);
    if (!DEFAULT_EMAIL_PASS) {
        console.warn('AVISO: A senha do e-mail (EMAIL_PASS) não está definida. O servidor pode não conseguir enviar e-mails.');
    }
});