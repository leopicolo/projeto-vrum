const express = require('express');
const { handleContactForm } = require('../controllers/contactController');

const router = express.Router();

// Rota para o formulário
router.post('/contact', handleContactForm);

module.exports = router;
