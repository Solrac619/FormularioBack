const bcrypt = require('bcryptjs');
const { generarToken } = require('../auth/auth');

const USUARIO = {
  email: 'admin@crm.com',
  passwordHash: bcrypt.hashSync('admin123', 10),
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (email !== USUARIO.email || !bcrypt.compareSync(password, USUARIO.passwordHash)) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = generarToken(email);
  res.json({ token });
};

module.exports = { login };
