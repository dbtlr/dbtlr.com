import { Link } from '@remix-run/react';

import Lightbulb from '~/images/lightbulb.svg?react';

const links = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/contact',
    label: 'Contact',
  },
];

export function PageHeader() {
  return (
    <header className="flex flex-row items-center justify-between">
      <h2 className="flex -rotate-1 flex-row items-center gap-2">
        <Lightbulb className="size-8 text-yellow-400" />
        <span className="border-b-4 border-accent pb-1 text-3xl font-extrabold md:text-4xl">
          Drew Butler
        </span>
      </h2>
      <nav className="">
        <ul className="flex flex-row items-center gap-5">
          {links.map(({ href, label }, i) => (
            <li key={`header-link-${i}`}>
              <Link className="hover:text-accent hover:underline" to={href}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
