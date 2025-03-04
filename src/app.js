const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const usuarioRoutes = require('./routes/usuarioRoutes');
const contactRoutes = require('./routes/contactRoutes');
const cors = require('cors');
require('dotenv').config();
const compression = require('compression');
const { body, validationResult } = require('express-validator');

// Criação do app
const app = express();

// Middleware para processar dados de formulários
app.use(express.urlencoded({ extended: true })); // Para formulários HTML
app.use(express.json()); // Para JSON, se necessário

// Middleware para compressão de respostas
app.use(compression());

// Configuração de CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Altere '*' para o domínio confiável em produção
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Validação de exemplo (mova isso para contactRoutes se for relacionado a contatos)
app.post('/api/example', 
  body('email').isEmail().withMessage('Email inválido'),
  body('mensagem').isLength({ min: 10 }).withMessage('Mensagem muito curta'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send('Dados válidos');
  });

// Rotas da API devem vir antes dos arquivos estáticos
app.use('/api', contactRoutes);

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.resolve(__dirname, '../public')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

// Rotas adicionais
app.use('/usuarios', usuarioRoutes);

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).send('Página não encontrada.');
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack); // Log no servidor
  res.status(500).send('Erro interno do servidor.');
});

module.exports = app; // Exportar o app para uso em outro arquivo
