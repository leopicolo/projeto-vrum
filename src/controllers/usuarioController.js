const Usuario = require('../models/usuarioModel'); // Importa o modelo
const emailService = require('../services/emailService');

// Criar um novo usuário
exports.criarUsuario = (req, res) => {
    const { name, phone, email } = req.body;

    // Validação dos campos
    if (!name || !phone || !email) {
        return res.status(400).send('Nome, telefone e email são obrigatórios!');
    }

    if (phone.length < 10 || phone.length > 11) {
        return res.status(400).send('O telefone deve conter DDD e 8 ou 9 dígitos.');
    }

    // Verificar se o email já existe no banco
    Usuario.buscarPorEmail(email, (err, usuarioExistente) => {
        if (err) {
            console.error('Erro ao verificar e-mail:', err);
            return res.status(500).send('Erro ao verificar e-mail.');
        }

        if (usuarioExistente) {
            return res.status(400).send('E-mail já cadastrado!');
        }

        // Inserir o usuário no banco
        Usuario.criar(name, phone, email, (err, result) => {
            if (err) {
                console.error('Erro ao criar usuário:', err);
                return res.status(500).send('Erro ao criar usuário.');
            }

            // Enviar e-mail de confirmação
            const emailOptions = {
                to: email,
                subject: 'Confirmação de Contato - Vrum Express',
                text: `Olá ${name},\n\nEm breve entraremos em contato pelo telefone: (${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}.`,
            };

            emailService(emailOptions.to, emailOptions.subject, emailOptions.text)
                .then(() => {
                    console.log('E-mail enviado com sucesso!');
                    res.status(201).send({
                        message: 'Usuário criado com sucesso e e-mail enviado!',
                        id: result.insertId,
                    });
                })
                .catch((error) => {
                    console.error('Erro ao enviar e-mail:', error);
                    res.status(500).send('Usuário criado, mas não conseguimos enviar o e-mail.');
                });
        });
    });
};

// Listar todos os usuários
exports.listarUsuarios = (req, res) => {
    Usuario.listar((err, results) => {
        if (err) {
            console.error('Erro ao listar usuários:', err);
            return res.status(500).send('Erro ao listar usuários.');
        }

        res.status(200).send(results);
    });
};

// Exportar usuários
exports.exportarUsuarios = (req, res) => {
    Usuario.listar((err, results) => {
        if (err) {
            console.error('Erro ao exportar usuários:', err);
            return res.status(500).send('Erro ao exportar usuários.');
        }

        // Aqui você pode adaptar para exportar os dados como JSON, CSV, etc.
        res.status(200).json(results); // Retorna os dados como JSON
    });
};

// Excluir um usuário por ID
exports.excluirUsuario = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send('ID do usuário é obrigatório!');
    }

    Usuario.excluir(id, (err, result) => {
        if (err) {
            console.error('Erro ao excluir usuário:', err);
            return res.status(500).send('Erro ao excluir usuário.');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Usuário não encontrado!');
        }

        res.status(200).send('Usuário excluído com sucesso!');
    });
};
