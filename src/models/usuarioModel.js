const db = require('../utils/db'); // Certifique-se de ajustar o caminho

const Usuario = {
  listar: (callback) => {
    const query = 'SELECT * FROM usuarios';
    db.query(query, callback);
  },

  buscarPorEmail: (email, callback) => {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0] || null);
    });
  },

  criar: (nome, phone, email, message, callback) => {
    const query = 'INSERT INTO usuarios (nome, phone, email, message) VALUES (?, ?, ?, ?)';
    db.query(query, [nome, phone, email, message], callback);
  },
  
  excluir: (id, callback) => {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    db.query(query, [id], callback);
  },
};

module.exports = Usuario;
