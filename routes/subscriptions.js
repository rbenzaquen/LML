const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const db = require('../db');
const PLANS = require('../config/plans');

const router = express.Router();

// POST /api/subscriptions - Crear suscripción (requiere auth)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.id;

    const validPlans = ['emprendedor', 'profesional', 'empresa'];
    if (!plan || !validPlans.includes(plan)) {
      return res.status(400).json({ error: 'Plan inválido. Elegí emprendedor, profesional o empresa.' });
    }

    const existing = db.subscriptions.findActiveByUserId(userId);

    if (existing) {
      return res.status(400).json({ error: 'Ya tenés una suscripción activa.' });
    }

    const subscription = db.subscriptions.create({ user_id: userId, plan });

    res.status(201).json({
      message: 'Suscripción activada correctamente.',
      subscription: {
        ...subscription,
        ...PLANS[subscription.plan],
      },
    });
  } catch (err) {
    console.error('Subscription error:', err);
    res.status(500).json({ error: 'Error al crear la suscripción.' });
  }
});

// GET /api/subscriptions/me - Mi suscripción (requiere auth)
router.get('/me', authMiddleware, (req, res) => {
  const sub = db.subscriptions.findActiveByUserId(req.user.id);

  if (!sub) {
    return res.json({ subscription: null });
  }

  res.json({
    subscription: {
      ...sub,
      ...PLANS[sub.plan],
    },
  });
});

module.exports = router;
