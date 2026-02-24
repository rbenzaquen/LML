# LML Brand Protection Membership

Plataforma de monitoreo marcario de Litvin Marzorati Legales. Los usuarios pueden registrarse, iniciar sesión y contratar planes de protección de marca.

**Slogan:** *"Protección continua online de tu marca, respaldada por Litvin Marzorati Legales."*

## Contenido

- **Landing** — Página principal con planes, beneficios y CTA
- **Registro / Login** — Autenticación de usuarios
- **Suscripción** — Planes Básico (USD 7/mes) y Profesional (USD 10/mes)
- **Dashboard** — Área de usuario con datos de cuenta y suscripción
- **email-lanzamiento.html** — Plantilla de email de lanzamiento

## Cómo ejecutar

```bash
npm install
npm start
```

La app corre en http://localhost:3000

Para desarrollo con recarga automática:

```bash
npm run dev
```

## Variables de entorno

Copiá `.env.example` a `.env` y configurá:

- `PORT` — Puerto del servidor (default: 3000)
- `JWT_SECRET` — Clave secreta para tokens (cambiar en producción)

## Estructura

```
├── server.js          # Servidor Express
├── config/plans.js    # Definición de planes
├── routes/            # auth, subscriptions
├── middleware/       # auth
├── db/               # Almacenamiento (JSON)
├── public/           # Páginas estáticas
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── suscribirse.html
│   ├── dashboard.html
│   └── css/
└── data/             # Datos (generado automáticamente)
```

## API

- `POST /api/auth/register` — Registro
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Usuario actual
- `GET /api/plans` — Lista de planes
- `POST /api/subscriptions` — Crear suscripción (requiere auth)
- `GET /api/subscriptions/me` — Mi suscripción (requiere auth)
