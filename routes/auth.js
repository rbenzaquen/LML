const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');

const router = express.Router();

// POST /api/auth/register
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('nombre').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, nombre } = req.body;

    if (db.users.findByEmail(email)) {
      return res.status(400).json({ error: 'Ya existe una cuenta con ese email.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = db.users.create({ email, password_hash: passwordHash, nombre: nombre || null });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    return res.status(201).json({
      user: { id: user.id, email: user.email, nombre: user.nombre },
      token,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Error al registrar. Intentá de nuevo.' });
  }
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = db.users.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    res.json({
      user: { id: user.id, email: user.email, nombre: user.nombre },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const user = db.users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const sub = db.subscriptions.findActiveByUserId(user.id);

    res.json({
      user: { id: user.id, email: user.email, nombre: user.nombre },
      subscription: sub ? { plan: sub.plan, status: sub.status } : null,
    });
  } catch (err) {
    res.status(401).json({ error: 'Sesión inválida' });
  }
});

module.exports = router;
