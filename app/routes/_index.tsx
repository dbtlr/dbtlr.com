import type { MetaFunction } from '@remix-run/cloudflare';

import drewImg from '~/images/drew-memoji.png';
import Github from '~/images/github.svg?react';
import LinkedIn from '~/images/linkedin.svg?react';
import X from '~/images/x.svg?react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Drew Butler' },
    {
      name: 'description',
      content: 'Drew Butler',
    },
  ];
};

const links = [
  {
    title: 'Github',
    href: 'https://github.com/dbltr',
    image: Github,
  },
  {
    title: 'LinkedIn',
    href: 'https://linkedin.com/in/drewbutler',
    image: LinkedIn,
  },
  {
    title: 'X',
    href: 'https://x.com/drewbutlerme',
    image: X,
  },
];

export default function Index() {
  return (
    <main className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-y-10 md:flex-row md:justify-between md:gap-x-24">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">
            Hi there, I&apos;m <span className="text-accent">Drew</span> 👋
          </h1>
          <p className="text-xl leading-9">
            I&apos;m a father, a software engineer, a leader, and a technical
            enthusiest. I enjoy building software and solving interesting
            problems. I live in Brooklyn, NY with my wife and 3 kids. I have a
            passion for movies and fantasy novels.
          </p>
          <nav>
            <ul className="flex flex-row items-center justify-center gap-4 md:justify-start">
              {links.map(({ title, href, image: Image }, i) => (
                <li key={i}>
                  <a href={href} target="_blank" rel="noreferrer" title={title}>
                    <Image className="size-8 text-white hover:translate-y-1 hover:text-accent" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div>
          <img src={drewImg} alt="Drew Memoji" className="max-w-96" />
        </div>
      </div>
    </main>
  );
}
