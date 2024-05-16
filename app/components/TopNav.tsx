import { Link } from '@remix-run/react';

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

export function TopNav() {
  return (
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
  );
}
