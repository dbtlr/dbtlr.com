import Inter from '@fontsource/inter/index.css?url';
import { ErrorResponse, LinksFunction } from '@remix-run/cloudflare';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';
import MaterialSymbol from 'material-symbols/index.css?url';

import { PageFooter } from '~/components/PageFooter';
import { PageHeader } from '~/components/PageHeader';
import stylesheet from '~/styles/index.css?url';

import { ErrorPage } from './components/ErrorPage';
import { NotFound } from './components/NotFound';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  { rel: 'stylesheet', href: MaterialSymbol },
  { rel: 'stylesheet', href: Inter },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="min-h-screen">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-slate-900 text-gray-100">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError() as ErrorResponse;

  if (error?.status === 404) {
    return <NotFound />;
  }

  console.error(error);

  return <ErrorPage />;
}

export default function App() {
  return (
    <div className="mx-auto flex min-h-screen max-w-screen-lg flex-col gap-16">
      <PageHeader />
      <div className="grow px-6">
        <Outlet />
      </div>
      <PageFooter />
    </div>
  );
}
