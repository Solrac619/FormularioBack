// notificarLead.js
const axios = require('axios');
const nodemailer = require('nodemailer');


// Configura tu cuenta de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'solracyestom2015@gmail.com',           // ⚠️ Cambia esto
    pass: 'hjxe kvgi yulg oqls'      // ⚠️ Usa contraseña de aplicación
  }
});

const notificarNuevoLead = async ({ nombre, correo, telefono, mensaje }) => {

  try {
    // 2. Enviar correo con Nodemailer
    const mailOptions = {
      from: 'solracyestom2015@gmail.com', // Mismo que el de la auth
      to: 'charliegarciaxix@gmail.com', // El correo donde recibirás el mensaje
      subject: '📬 Nuevo mensaje del formulario de contacto',
      text: `
Has recibido un nuevo lead desde tu sitio web:

Nombre: ${nombre}
Correo: ${correo}
Teléfono: ${telefono}
Mensaje: ${mensaje}
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Notificación enviada por correo');
  } catch (err) {
    console.error('❌ Error al enviar correo:', err.message);
  }
};

module.exports = { notificarNuevoLead };
