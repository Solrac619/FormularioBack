const jwt = require('jsonwebtoken');
const secret = 'carlosymichelle22';

const generarToken = (usuario) => {
  return jwt.sign({ usuario }, secret, { expiresIn: '2h' });
};

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.usuario = decoded.usuario;
    next();
  });
};

module.exports = { generarToken, verificarToken };
