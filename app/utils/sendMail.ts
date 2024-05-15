interface SendMailParams {
  name: string;
  email: string;
  message: string;
}

export async function sendMail({ name, email, message }: SendMailParams) {
  const url = 'https://api.mailersend.com/v1/email';
  const apiKey = process.env.MAILERSEND_API_KEY;

  const data = {
    from: {
      email: process.env.EMAIL_FROM,
      name: process.env.EMAIL_FROM_NAME,
    },
    to: [
      {
        email: process.env.EMAIL_TO,
        name: process.env.EMAIL_TO_NAME,
      },
    ],
    subject: process.env.EMAIL_SUBJECT,
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
