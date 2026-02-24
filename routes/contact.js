const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');

const router = express.Router();

// POST /api/contact - Enviar consulta de contacto
router.post('/', [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('telefono').optional().trim(),
  body('marca').optional().trim(),
  body('mensaje').optional().trim(),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = db.contacts.create({
      nombre: req.body.nombre.trim(),
      email: req.body.email.trim(),
      telefono: req.body.telefono?.trim() || null,
      marca: req.body.marca?.trim() || null,
      mensaje: req.body.mensaje?.trim() || null,
    });

    res.status(201).json({ message: 'Consulta recibida correctamente.', id: contact.id });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Error al enviar la consulta.' });
  }
});

module.exports = router;
