const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

async function sendPasswordReset(to, resetLink) {
  const transport = getTransporter();
  if (!transport) return false;

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  await transport.sendMail({
    from: `"LML Brand Protection" <${from}>`,
    to,
    subject: 'Restablecer contraseña - LML Brand Protection Membership',
    html: `
      <p>Hola,</p>
      <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en LML Brand Protection Membership.</p>
      <p>Hacé clic en el siguiente enlace para crear una nueva contraseña (válido por 1 hora):</p>
      <p><a href="${resetLink}" style="background:#c9a227;color:#1a365d;padding:0.75rem 1.5rem;text-decoration:none;border-radius:6px;display:inline-block;font-weight:600;">Restablecer contraseña</a></p>
      <p>Si no solicitaste este cambio, ignorá este mensaje.</p>
      <p>— Litvin Marzorati Legales</p>
    `,
    text: `Restablecer contraseña: ${resetLink}\n\nSi no solicitaste este cambio, ignorá este mensaje.`,
  });
  return true;
}

module.exports = { sendPasswordReset };
