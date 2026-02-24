require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptions');
const brandsRoutes = require('./routes/brands');
const contactRoutes = require('./routes/contact');
const PLANS = require('./config/plans');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/contact', contactRoutes);
app.get('/api/plans', (req, res) => {
  res.json({ plans: Object.values(PLANS) });
});

// Páginas
const pages = [
  ['/', 'index.html'],
  ['/como-funciona', 'como-funciona.html'],
  ['/planes', 'planes.html'],
  ['/para-quien-es', 'para-quien-es.html'],
  ['/casos-beneficios', 'casos-beneficios.html'],
  ['/faq', 'faq.html'],
  ['/sobre-lml', 'sobre-lml.html'],
  ['/contacto', 'contacto.html'],
  ['/login', 'login.html'],
  ['/register', 'register.html'],
  ['/suscribirse', 'suscribirse.html'],
  ['/dashboard', 'dashboard.html'],
];

pages.forEach(([route, file]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', file));
  });
});

// 404 - debe ir después de todas las rutas
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

app.listen(PORT, () => {
  console.log(`LML Brand Protection Membership corriendo en http://localhost:${PORT}`);
});
