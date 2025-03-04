const fs = require('fs');
const http = require('http');
const https = require('https');
const app = require('./app'); // Importa o app configurado
const logger = require('./utils/logger');
require('dotenv').config(); // Carrega as variáveis do .env

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;

const PORT_HTTP = process.env.PORT_HTTP || 80;
const PORT_HTTPS = process.env.PORT_HTTPS || 443;
// Opções para HTTPS
const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY), // Caminho para o privkey.pem
  cert: fs.readFileSync(process.env.SSL_CERT), // Caminho para o fullchain.pem
};

// Criar servidor HTTPS
https.createServer(httpsOptions, app)
  .listen(PORT_HTTPS, () => {
    logger.info(`Servidor HTTPS rodando em https://localhost:${PORT_HTTPS}`);
  })
  .on('error', (err) => {
    logger.error(`Erro ao iniciar o servidor HTTPS na porta ${PORT_HTTPS}: ${err.message}`);
  });

// Criar servidor HTTP para redirecionar para HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(PORT_HTTP, () => {
  logger.info(`Servidor HTTP redirecionando para HTTPS na porta ${PORT_HTTP}`);
});

