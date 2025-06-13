const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); // Para limitação de taxa
require('dotenv').config(); // Para carregar variáveis de ambiente

// Inicializa o aplicativo Express
const app = express();
const PORT = process.env.PORT || 3000; // Define a porta do servidor

// Variáveis de ambiente e padrões
const DEFAULT_EMAIL_USER = process.env.EMAIL_USER || 'contato@l009.com.br';
const DEFAULT_EMAIL_PASS = process.env.EMAIL_PASS;
const DEFAULT_SMTP_HOST = 'smtp.hostinger.com';
const DEFAULT_SMTP_PORT = 465;

// Middleware para CORS e análise de JSON
app.use(cors()); // Permite requisições de diferentes origens
app.use(express.json()); // Analisa corpos de requisição JSON

// Configuração do limitador de taxa
// Permite 5 requisições a cada 10 minutos por IP
const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 5, // Limita cada IP a 5 requisições por janela de 10 minutos
    message: 'Muitas requisições deste IP, por favor, tente novamente após 10 minutos.',
    standardHeaders: true, // Retorna as informações de limite de taxa nos cabeçalhos HTTP (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset)
    legacyHeaders: false, // Desabilita os cabeçalhos X-RateLimit-*
});

// Aplica o limitador de taxa a todas as requisições POST para a rota raiz
app.post('/', apiLimiter, async (req, res) => {
    const {
        To,
        Subject,
        Message,
        html,
        smtp,
        port
    } = req.body;

    // Validação de parâmetros obrigatórios
    if (!To || !Subject || !Message) {
        console.error('Erro: Parâmetros obrigatórios ausentes (To, Subject, Message).');
        return res.status(400).json({ success: false, message: 'Todos os parâmetros (To, Subject, Message) são obrigatórios.' });
    }

    // Validação básica do formato de e-mail para o campo 'To'
    // Regex simples para validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(To)) {
        console.error(`Erro: Formato de e-mail inválido para o destinatário: ${To}`);
        return res.status(400).json({ success: false, message: 'O endereço de e-mail do destinatário possui um formato inválido.' });
    }

    const currentEmailUser = DEFAULT_EMAIL_USER;
    const currentEmailPass = DEFAULT_EMAIL_PASS;
    const currentSmtpHost = smtp || DEFAULT_SMTP_HOST;
    const currentSmtpPort = port || DEFAULT_SMTP_PORT;

    let currentSmtpSecure;
    // Define 'secure' baseado na porta SMTP
    if (currentSmtpPort === 465) {
        currentSmtpSecure = true; // Porta 465 geralmente usa SSL/TLS
    } else if (currentSmtpPort === 587) {
        currentSmtpSecure = false; // Porta 587 geralmente usa STARTTLS (não 'secure' por padrão)
    } else {
        currentSmtpSecure = false; // Outras portas, não seguras por padrão
    }

    // Verifica se a senha do e-mail está configurada
    if (!currentEmailPass) {
        console.error('Erro de configuração do servidor: Senha do e-mail remetente não definida (EMAIL_PASS). Verifique as variáveis de ambiente.');
        return res.status(500).json({ success: false, message: 'Erro de configuração do servidor: Senha do e-mail remetente não definida. Por favor, contate o administrador.' });
    }

    try {
        // Cria o transportador Nodemailer
        const transporter = nodemailer.createTransport({
            host: currentSmtpHost,
            port: currentSmtpPort,
            secure: currentSmtpSecure,
            auth: {
                user: currentEmailUser,
                pass: currentEmailPass
            },
            tls: {
                // Desabilita a verificação do certificado, útil para desenvolvimento, mas evite em produção
                // rejectUnauthorized: false
            }
        });

        // Opções do e-mail
        const mailOptions = {
            from: currentEmailUser,
            to: To,
            subject: Subject,
            bcc: 'danmzzu@gmail.com' // Endereço de BCC hardcoded
        };

        // Define o corpo do e-mail como HTML ou texto plano
        if (!!html) {
            mailOptions.html = Message;
        } else {
            mailOptions.text = Message;
        }

        // Envia o e-mail
        const info = await transporter.sendMail(mailOptions);

        console.log('Email enviado com sucesso: %s', info.messageId);
        res.status(200).json({ success: true, message: 'Email enviado com sucesso!', messageId: info.messageId });
    } catch (error) {
        console.error('Erro detalhado ao enviar email:', error); // Log mais detalhado do erro
        res.status(500).json({ success: false, message: 'Erro ao enviar email. Por favor, tente novamente mais tarde.', error: error.message });
    }
});

// Inicia o servidor e escuta na porta definida
app.listen(PORT, () => {
    console.log(`Servidor de envio de e-mails rodando na porta ${PORT}.`);
    if (!DEFAULT_EMAIL_PASS) {
        console.warn('AVISO: A senha do e-mail (EMAIL_PASS) não está definida. O servidor pode não conseguir enviar e-mails.');
    }
});