const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController'); // Certifique-se de que o caminho está correto

// Rota para criar usuário
router.post('/', usuarioController.criarUsuario);

// Rota para listar usuários
router.get('/', usuarioController.listarUsuarios);

// Rota para exportar usuários
router.get('/export', usuarioController.exportarUsuarios);

// Rota para excluir usuário
router.delete('/:id', usuarioController.excluirUsuario);

module.exports = router;
