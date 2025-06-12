async function sendmail() {
    const emailData = {
        To: "maria@example.com",
        Subject: "L009 - Notificação",
        Message: "<p>Este é um <strong>email de teste</strong> enviado com as configurações padrão da API (L009).</p>",
        html: true
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
            console.log('Email Padrão Enviado com Sucesso');
            console.log('Sucesso:', data.message);
        } else {
            console.error('Erro ao Enviar Email Padrão');
            console.log('Erro:', data.error);
        }
    } catch (error) {
        console.error('Erro na requisição fetch (Padrão):', error);
    }
}

sendmail();