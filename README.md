# LML Brand Protection Membership

Plataforma de monitoreo marcario de Litvin Marzorati Legales. Vigilancia marcaria Argentina.

**Slogan:** *"Protección continua online de tu marca, respaldada por Litvin Marzorati Legales."*

## Contenido

- **Inicio** — Landing con propuesta de valor y CTA
- **Cómo funciona** — 4 pasos: Suscripción, Vinculación, Monitoreo, Alerta
- **Planes** — Emprendedor (USD 7), Profesional (USD 10), Empresa (USD 25)
- **¿Para quién es?** — Emprendedores, startups, creadores, etc.
- **Casos y beneficios** — Riesgos sin monitoreo vs. con monitoreo
- **FAQ** — Preguntas frecuentes
- **Sobre LML** — Presentación del estudio
- **Contacto** — Formulario (nombre, email, teléfono, marca a monitorear)
- **Registro / Login** — Autenticación
- **Suscripción** — Elegir plan y agregar marcas a monitorear
- **Dashboard** — Área de usuario con marcas

## Cómo ejecutar

```bash
npm install
npm start
```

La app corre en http://localhost:3000

## Estructura

```
├── server.js
├── config/plans.js      # Emprendedor, Profesional, Empresa
├── routes/             # auth, subscriptions, brands, contact
├── db/store.js         # Usuarios, suscripciones, marcas, contactos
├── public/
│   ├── index.html
│   ├── como-funciona.html
│   ├── planes.html
│   ├── para-quien-es.html
│   ├── casos-beneficios.html
│   ├── faq.html
│   ├── sobre-lml.html
│   ├── contacto.html
│   ├── login.html, register.html, suscribirse.html, dashboard.html
│   └── css/styles.css
└── data/store.json     # Datos (generado)
```

## API

- `POST /api/auth/register` — Registro
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Usuario actual
- `GET /api/plans` — Lista de planes
- `POST /api/subscriptions` — Crear suscripción (emprendedor | profesional | empresa)
- `GET /api/subscriptions/me` — Mi suscripción
- `GET /api/brands` — Mis marcas
- `POST /api/brands` — Agregar marca
- `DELETE /api/brands/:id` — Eliminar marca
- `POST /api/contact` — Enviar consulta de contacto
