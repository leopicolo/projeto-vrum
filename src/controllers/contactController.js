const sendEmail = require('../services/emailService'); // Certifique-se de que o caminho está correto
const db = require('../utils/db'); // Certifique-se de que a conexão está configurada corretamente

exports.handleContactForm = async (req, res) => {
    const { name, phone, email, message } = req.body;

    // Validação dos campos
    if (!name || !phone || !email || !message) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    if (phone.length < 10 || phone.length > 11) {
        return res.status(400).json({ message: 'O telefone deve conter DDD e 8 ou 9 dígitos.' });
    }

    try {
        // Simplesmente enviar o e-mail ou usar a mensagem
        const truncatedMessage = message.length > 30 ? message.slice(0, 30) + '...' : message;

const emailBody = `
Olá ${name},

Agradecemos por sua mensagem! Recebemos a seguinte solicitação de sua parte: 
"${truncatedMessage}"Nossa equipe já está analisando o seu pedido e entraremos em contato em breve pelo telefone (${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}. 
Enquanto isso, se precisar de algo urgente, você pode falar diretamente conosco pelo WhatsApp: [Clique aqui](https://bit.ly/40J8VvD).
Atenciosamente,  
Equipe Vrum Express  
Seu parceiro em entregas rápidas e confiáveis!`;

await sendEmail(email, 'Recebemos sua mensagem! 🚀', emailBody);



        console.log('E-mail enviado com sucesso.');

        // Salvar apenas os dados essenciais no banco
        const sql = 'INSERT INTO usuarios (name, phone, email) VALUES (?, ?, ?)';
        const values = [name, phone, email];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Erro ao salvar no banco de dados:', err);
                return res.status(500).json({ message: 'Erro ao salvar os dados no banco.' });
            }

            console.log('Contato salvo com sucesso no banco de dados:', result);
            return res.status(200).json({
                message: 'Dados processados com sucesso. Verifique seu e-mail para mais informações!',
            });
        });
    } catch (error) {
        console.error('Erro ao processar o formulário:', error);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};
