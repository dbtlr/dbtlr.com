export interface MAILER_ENV {
  MAILERSEND_API_KEY: string;
  EMAIL_FROM: string;
  EMAIL_FROM_NAME: string;
  EMAIL_TO: string;
  EMAIL_TO_NAME: string;
  EMAIL_SUBJECT: string;
}

interface SendMailParams {
  name: string;
  email: string;
  message: string;
  env: MAILER_ENV;
}

export async function sendMail({ name, email, message, env }: SendMailParams) {
  const url = 'https://api.mailersend.com/v1/email';
  const apiKey = env.MAILERSEND_API_KEY;

  const data = {
    from: {
      email: env.EMAIL_FROM,
      name: env.EMAIL_FROM_NAME,
    },
    to: [
      {
        email: env.EMAIL_TO,
        name: env.EMAIL_TO_NAME,
      },
    ],
    subject: env.EMAIL_SUBJECT,
    text: `From ${name} - ${email}\n\n${message}`,
    html: `From ${name} - ${email}<br /><br />${message}`,
  };

  return await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  });
}
