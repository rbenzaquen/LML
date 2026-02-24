const express = require('express');
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const db = require('../db');
const PLANS = require('../config/plans');

const router = express.Router();

function getMaxBrands(userId) {
  const sub = db.subscriptions.findActiveByUserId(userId);
  if (!sub) return 0;
  return PLANS[sub.plan]?.maxBrands ?? 0;
}

// GET /api/brands - Listar marcas del usuario
router.get('/', authMiddleware, (req, res) => {
  const brands = db.brands.findByUserId(req.user.id);
  res.json({ brands });
});

// POST /api/brands - Agregar marca
router.post('/', authMiddleware, [
  body('name').trim().notEmpty().withMessage('El nombre de la marca es obligatorio'),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const maxBrands = getMaxBrands(userId);

    if (maxBrands === 0) {
      return res.status(403).json({ error: 'Necesitás una suscripción activa para agregar marcas.' });
    }

    const count = db.brands.countByUserId(userId);
    if (count >= maxBrands) {
      const sub = db.subscriptions.findActiveByUserId(userId);
      const planName = PLANS[sub?.plan]?.name ?? sub?.plan ?? 'actual';
      return res.status(403).json({
        error: `Tu plan ${planName} permite hasta ${maxBrands} marcas. Ya tenés ${count}.`,
      });
    }

    const brand = db.brands.create({
      user_id: userId,
      name: req.body.name.trim(),
    });

    res.status(201).json({ brand });
  } catch (err) {
    console.error('Brand create error:', err);
    res.status(500).json({ error: 'Error al agregar la marca.' });
  }
});

// DELETE /api/brands/:id - Eliminar marca
router.delete('/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const deleted = db.brands.delete(id, req.user.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Marca no encontrada' });
  }

  res.json({ ok: true });
});

module.exports = router;
