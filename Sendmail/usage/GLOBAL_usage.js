async function sendmail() {
    const emailData = {
        Brand: "Minha Marca Customizada",
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
        const response = await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        if (response.ok) {
            console.log('Email Enviado com Sucesso');
        } else {
            console.error('Erro ao Enviar Email');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

sendmail();