import { ActionFunctionArgs, json } from '@remix-run/cloudflare';
import { Form, useActionData } from '@remix-run/react';
import { useEffect } from 'react';

import { InputField } from '~/components/Form/InputField';
import { TextareaField } from '~/components/Form/TextareaField';
import { MAILER_ENV, sendMail } from '~/utils/sendMail';

interface ErrorResponse {
  name?: string;
  email?: string;
  message?: string;
  unknown?: string;
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();

  const email = String(formData.get('email'));
  const name = String(formData.get('name'));
  const message = String(formData.get('message'));

  const errors: ErrorResponse = {};

  if (!email.includes('@')) {
    errors.email = 'Invalid email address';
  }

  if (!name) {
    errors.name = 'A name is required';
  }

  if (!message) {
    errors.message = 'A message is required';
  }

  if (Object.keys(errors).length > 0) {
    return json({ success: false, errors });
  }

  const env = context.env as MAILER_ENV;

  if (env.MAILERSEND_API_KEY === undefined) {
    return json({
      success: false,
      errors: {
        unknown: 'Mail API Key is not set',
      } as ErrorResponse,
    });
  }

  try {
    await sendMail({ name, email, message, env });
    return json({ success: true, errors });
  } catch (e) {
    console.error(e);
    return json({
      success: false,
      errors: {
        unknown: String(e),
      } as ErrorResponse,
    });
  }
}

export default function Contact() {
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.errors?.unknown) console.error(actionData?.errors?.unknown);
  }, [actionData?.errors?.unknown]);

  return (
    <div className="flex max-w-screen-sm flex-col gap-5">
      <h1 className="text-2xl font-semibold">Send me a message</h1>
      <p className="">
        Have a question? Want to chat? Maybe want to work together? Send me a
        message using the form below and I&apos;ll get back to you as soon as I
        can.
      </p>
      {actionData?.success ? (
        <div className="mt-10 border-4 border-accent bg-gray-100 p-5 text-center text-xl font-semibold text-gray-800">
          <h2>Your message has been sent.</h2>
        </div>
      ) : (
        <>
          {actionData?.errors?.unknown && (
            <div className="mt-10 border-4 border-accent bg-gray-100 p-5 text-center text-xl font-semibold text-gray-800">
              <h2>An unknown error occured while sending your message</h2>
            </div>
          )}
          <Form method="post" className="flex flex-col gap-5 md:w-96">
            <InputField
              name="name"
              label="Name"
              placeholder="Your Name"
              error={actionData?.errors?.name}
            />
            <InputField
              name="email"
              label="Email"
              type="email"
              placeholder="you@email.com"
              error={actionData?.errors?.email}
            />
            <TextareaField
              rows={4}
              name="message"
              label="Message"
              placeholder="Type your message here..."
              defaultValue={''}
              error={actionData?.errors?.message}
            />
            <button
              type="submit"
              className="rounded-md bg-accent px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Send Message
            </button>
          </Form>
        </>
      )}
    </div>
  );
}
