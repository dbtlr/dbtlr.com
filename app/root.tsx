import Inter from '@fontsource/inter/index.css?url';
import { LinksFunction } from '@remix-run/cloudflare';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import MaterialSymbol from 'material-symbols/index.css?url';

import { PageHeader } from '~/components/PageHeader';
import stylesheet from '~/styles/index.css?url';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  { rel: 'stylesheet', href: MaterialSymbol },
  { rel: 'stylesheet', href: Inter },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-900 text-gray-100">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="mx-auto flex max-w-screen-lg flex-col gap-16 px-3 py-6">
      <PageHeader />
      <Outlet />
    </div>
  );
}
