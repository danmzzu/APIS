async function sendEmail() {
    const emailData = {
        SMTP: "smtp.example.com",
        SMTP_PORT: 587,
        SECURE: false,
        BRAND: "Minha Marca",
        FROM: "seu_email@example.com",
        TO: "destinatario@example.com",
        SUBJECT: "Teste de E-mail via API",
        MESSAGE: "Olá, este é um e-mail de teste enviado pela API!",
        PASSWORD: "sua_senha_do_email",
        HTML_ENABLED: false
    };

    try {
        const response = await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('E-mail enviado com sucesso:', data.message);
            console.log('ID da Mensagem:', data.messageId);
        } else {
            console.error('Erro ao enviar e-mail:', data.message);
            console.error('Detalhes do erro:', data.error);
        }
    } catch (error) {
        console.error('Erro na requisição fetch:', error);
    }
}

sendEmail();