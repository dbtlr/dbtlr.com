import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Link, useLocation } from '@remix-run/react';
import clsx from 'clsx';

import Lightbulb from '~/images/lightbulb.svg?react';

const navigation = [
  {
    href: '/',
    label: 'Home',
    name: 'home',
  },
  {
    href: '/contact',
    label: 'Contact',
    name: 'contact',
  },
];

export function PageHeader() {
  const location = useLocation();

  return (
    <Disclosure as="header" className="">
      {({ open }) => (
        <>
          <div className="relative mx-6 mt-6 flex flex-row items-center justify-between">
            <h2 className="flex -rotate-1 flex-row items-start gap-2">
              <Lightbulb className="size-8 text-yellow-400" />
              <Link
                to="/"
                className="border-b-4 border-accent pb-1 text-3xl font-extrabold outline-none md:text-4xl"
              >
                Drew Butler
              </Link>
            </h2>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      item.href === location.pathname
                        ? 'bg-accent text-white'
                        : 'text-gray-300 hover:text-accent',
                      'rounded-md px-3 py-2 text-sm font-medium hover:underline',
                    )}
                    aria-current={
                      item.href === location.pathname ? 'page' : undefined
                    }
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <span
                    className="material-symbols-outlined block !text-3xl"
                    aria-hidden="true"
                  >
                    close
                  </span>
                ) : (
                  <span
                    className="material-symbols-outlined block !text-3xl"
                    aria-hidden="true"
                  >
                    menu
                  </span>
                )}
              </DisclosureButton>
            </div>
          </div>

          <DisclosurePanel className="absolute inset-x-0 bottom-0 top-16 mt-6 bg-gray-800/95 sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={clsx(
                    item.href === location.pathname
                      ? 'bg-accent text-white'
                      : 'bg-gray-800 text-gray-300 hover:text-accent',
                    'block rounded-md px-3 py-2 text-base font-medium hover:underline',
                  )}
                  aria-current={
                    item.href === location.pathname ? 'page' : undefined
                  }
                >
                  {item.label}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
