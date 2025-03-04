const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Nível padrão (info, error, warn, etc.)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // Exibe no console
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Apenas erros
    new winston.transports.File({ filename: 'logs/combined.log' }), // Todos os logs
  ],
});

module.exports = logger;
