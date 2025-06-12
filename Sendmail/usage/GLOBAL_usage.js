async function sendmail() {
    const emailData = {
        To: "destino.custom@example.com",
        Subject: "Email de Teste (SMTP Personalizado)",
        Message: "Este é um email de teste enviado com configurações de SMTP personalizadas. Nenhuma formatação HTML.",
        html: true,
        email: "meu_email_personalizado@outrodominio.com",
        password: "minha_senha_personalizada",
        smtp: "smtp.outrodominio.com",
        port: 587
    };

    try {
        const response = await fetch('https://l009-api-sendmail-railway.up.railway.app/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Email Enviado com Sucesso');
            console.log('Sucesso:', data.message);
        } else {
            console.error('Erro ao Enviar Email');
            console.log('Erro:', data.error);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

sendmail();