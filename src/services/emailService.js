const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Usa a variável de ambiente
    pass: process.env.EMAIL_PASS  // Usa a variável de ambiente
  }
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"Vrum Express" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Vamos acelerar suas entregas? 🚀",
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail enviado com sucesso para ${to}`);
  } catch (error) {
    console.error(`Erro ao enviar o e-mail para ${to}:`, error);
    throw error;
  }
};

module.exports = sendEmail;