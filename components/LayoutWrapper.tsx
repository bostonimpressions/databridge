'use client';

import React, { useState, useEffect, useCallback, ReactNode, SVGProps, MouseEvent } from 'react';
import { FaLinkedin, FaChevronDown } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

type LinkClickHandler = (event?: MouseEvent<HTMLAnchorElement>) => void;

interface NavListItem {
  name: string;
  href: string;
  dropdown?: NavListItem[];
}

type SVGIconProps = SVGProps<SVGSVGElement>;

interface NavLinkProps {
  item: NavListItem;
  isMobile?: boolean;
  isScrolled: boolean;
  onClick?: LinkClickHandler;
}

interface HeaderProps {
  isScrolled: boolean;
  servicePages: Array<{ title: string; slug: string }>;
  industryPages: Array<{ title: string; slug: string }>;
}

interface LayoutWrapperProps {
  children: ReactNode;
  servicePages?: Array<{ title: string; slug: string }>;
  industryPages?: Array<{ title: string; slug: string }>;
}

const Menu = (props: SVGIconProps) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const X = (props: SVGIconProps) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const useScrollEffect = (threshold: number = 400): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
};

// Dropdown menu component
const DropdownMenu = ({
  items,
  isScrolled,
  isMobile = false,
  onLinkClick,
}: {
  items: NavListItem[];
  isScrolled: boolean;
  isMobile?: boolean;
  onLinkClick?: LinkClickHandler;
}) => {
  if (isMobile) {
    return (
      <div className="ml-4 space-y-1 border-l-2 border-blue-100 py-2 pl-4">
        {items.map((subItem) => (
          <Link
            key={subItem.href}
            href={subItem.href}
            onClick={onLinkClick}
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
          >
            {subItem.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute left-0 top-full z-50 pt-2">
      <div className="w-max min-w-[280px] max-w-xs rounded-xl bg-white py-2 shadow-2xl ring-1 ring-gray-900/5">
        {items.map((subItem) => (
          <Link
            key={subItem.href}
            href={subItem.href}
            className="block px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-blue-50 hover:pl-5 hover:text-blue-600"
          >
            {subItem.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

// Component to render individual links with dropdown support
const NavLink = ({ item, isMobile = false, isScrolled, onClick }: NavLinkProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const desktopClasses = isScrolled
    ? 'text-gray-700 hover:text-blue-600'
    : 'text-gray-700 hover:text-blue-600';

  const hasDropdown = item.dropdown && item.dropdown.length > 0;

  if (isMobile) {
    return (
      <div>
        <div
          className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-gray-800 transition-colors hover:bg-gray-50"
          onClick={() => {
            if (hasDropdown) {
              setIsDropdownOpen(!isDropdownOpen);
            }
          }}
        >
          {hasDropdown ? (
            <>
              <span className="text-base font-semibold">{item.name}</span>
              <FaChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </>
          ) : (
            <Link
              href={item.href}
              onClick={onClick}
              className="w-full text-base font-semibold hover:text-blue-600"
            >
              {item.name}
            </Link>
          )}
        </div>
        {hasDropdown && isDropdownOpen && item.dropdown && (
          <DropdownMenu
            items={item.dropdown}
            isScrolled={isScrolled}
            isMobile={true}
            onLinkClick={onClick}
          />
        )}
      </div>
    );
  }

  if (hasDropdown) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <button
          className={`flex items-center gap-1.5 text-base font-medium transition-colors ${desktopClasses}`}
        >
          {item.name}
          <FaChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {isDropdownOpen && item.dropdown && (
          <DropdownMenu items={item.dropdown} isScrolled={isScrolled} />
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`text-base font-medium transition-colors ${desktopClasses}`}
    >
      {item.name}
    </Link>
  );
};

// Main Navigation Component
const Header = ({ isScrolled, servicePages, industryPages }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Build navigation items with dropdowns
  const navigationItems: NavListItem[] = [
    { name: 'Home', href: '/' },
    {
      name: 'Services',
      href: '/services',
      dropdown: servicePages.map((page) => ({
        name: page.title,
        href: `/services/${page.slug}`,
      })),
    },
    {
      name: 'Industries',
      href: '/industries',
      dropdown: industryPages.map((page) => ({
        name: page.title,
        href: `/industries/${page.slug}`,
      })),
    },
    { name: 'About', href: '/about' },
  ];

  const headerClasses = isScrolled
    ? 'fixed top-0 left-0 w-full z-50 shadow-lg backdrop-blur-md bg-white/90'
    : 'absolute top-0 left-0 w-full z-50 bg-transparent';

  const handleLinkClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const logoColorClass = 'text-blue-600';

  return (
    <header className={headerClasses + ' h-20 transition-all duration-300'}>
      <div className="container mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="shrink-0">
          <span className={`text-2xl font-black transition-colors duration-300 ${logoColorClass}`}>
            <Link href="/">
              <Image src="/logo.svg" alt="DataBridge Sites" width={140} height={40} />
            </Link>
          </span>
        </div>

        <nav className="hidden items-center space-x-8 md:flex">
          {navigationItems.map((item) => (
            <NavLink key={item.name} item={item} isScrolled={isScrolled} />
          ))}
          <Link href="/contact">
            <button className="btn-primary-green">Contact</button>
          </Link>
        </nav>

        <button
          className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute left-0 top-20 w-full border-t border-gray-200 bg-white shadow-xl md:hidden">
          <div className="max-h-[calc(100vh-5rem)] overflow-y-auto px-4 pb-4 pt-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                item={item}
                isMobile={true}
                isScrolled={isScrolled}
                onClick={handleLinkClick}
              />
            ))}
            <Link href="/contact" onClick={handleLinkClick} className="mt-4 block">
              <button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white transition duration-150 hover:bg-blue-700">
                Contact
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

// Main Layout Wrapper Component
const LayoutWrapper = ({ children, servicePages = [], industryPages = [] }: LayoutWrapperProps) => {
  const scrollThreshold = 400;
  const isScrolled = useScrollEffect(scrollThreshold);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isScrolled={isScrolled} servicePages={servicePages} industryPages={industryPages} />

      <div className="pt-20">{children}</div>

      <footer className="bg-biscay-500 mt-10 p-12 text-white">
        <div className="container mx-auto">
          <div className="border-b-2 border-dashed border-white/20 pb-20 md:flex md:justify-between">
            <div className="mb-20 grid grid-cols-1 gap-10 md:m-0 md:grid-cols-3 md:gap-20">
              {servicePages.length > 0 && (
                <div>
                  <h5 className="mb-4 border-b border-white/10 pb-1 text-xl font-semibold text-white/40">
                    Services
                  </h5>
                  <ul className="flex flex-col gap-4">
                    {servicePages.map((page, index) => (
                      <li key={`${page.slug}-${index}`}>
                        <Link href={`/services/${page.slug}`}>{page.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {industryPages.length > 0 && (
                <div>
                  <h5 className="mb-4 border-b border-white/10 pb-1 text-xl font-semibold text-white/40">
                    Industries
                  </h5>
                  <ul className="flex flex-col gap-4">
                    {industryPages.map((page, index) => (
                      <li key={`${page.slug}-${index}`}>
                        <Link href={`/industries/${page.slug}`}>{page.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <ul className="flex flex-col gap-4">
                  <li>
                    <Link href="/about">About</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:text-right">
              <h3 className="text-3xl font-normal">Let&#39;s connect</h3>
              <div className="mt-2 flex justify-start gap-4 md:justify-end">
                <a
                  href="https://www.linkedin.com/company/nuview-it/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nugreen-500 hover:text-nugreen-600 transition"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={30} />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between py-10 md:flex-row">
            <div>
              <div className="pb-5">
                <Image src="/logo-white.png" alt="NuView" width={140} height={40} />
              </div>
              <p className="text-sm opacity-80">
                &copy; {new Date().getFullYear()} NuView. All rights reserved.
              </p>
            </div>
            <ul className="mt-auto flex gap-6 md:gap-12">
              {/*<li>*/}
              {/*  <Link href={'/terms'} className="underline">*/}
              {/*    Terms of Service*/}
              {/*  </Link>*/}
              {/*</li>*/}
              <li>
                <Link href={'/privacy-policy'} className="underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LayoutWrapper;
