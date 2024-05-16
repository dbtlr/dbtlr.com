import { Link } from '@remix-run/react';

import Lightbulb from '~/images/lightbulb.svg?react';

import { TopNav } from './TopNav';

export function PageHeader() {
  return (
    <header className="flex flex-row items-center justify-between">
      <h2 className="flex -rotate-1 flex-row items-center gap-2">
        <Lightbulb className="size-8 text-yellow-400" />
        <Link
          to="/"
          className="border-b-4 border-accent pb-1 text-3xl font-extrabold md:text-4xl"
        >
          Drew Butler
        </Link>
      </h2>
      <TopNav />
    </header>
  );
}
