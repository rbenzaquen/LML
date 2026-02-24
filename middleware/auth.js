const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado. Iniciá sesión.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Sesión expirada. Volvé a iniciar sesión.' });
  }
}

module.exports = { authMiddleware };
