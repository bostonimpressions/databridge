'use client';

import React, { useState, useEffect, useCallback, ReactNode, SVGProps, MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// --- Type Definitions ---
interface NavListItem {
  name: string;
  href: string;
}

type SVGIconProps = SVGProps<SVGSVGElement>;

interface NavLinkProps {
  item: NavListItem;
  isMobile?: boolean;
  isScrolled: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

interface HeaderProps {
  isScrolled: boolean;
}

interface LayoutWrapperProps {
  children: ReactNode;
}

// --- Icon Definitions ---
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

// --- Navigation Data ---
const navigationItems: NavListItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Resources', href: '/resources/blog' },
  { name: 'Contact', href: '/contact' },
];

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

// Component to render individual links
const NavLink = ({ item, isMobile = false, isScrolled, onClick }: NavLinkProps) => {
  // Desktop Nav Color Logic: White when transparent, dark gray when fixed/scrolled
  const desktopClasses = isScrolled
    ? 'text-gray-700 hover:text-blue-600' // Dark text on light background (scrolled)
    : 'text-gray-700 hover:text-blue-600'; // Light text on dark background (unscrolled over hero)

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`text-sm font-medium transition-colors ${
        isMobile
          ? 'block border-b border-gray-100 py-3 text-gray-800 hover:text-blue-600'
          : desktopClasses
      }`}
    >
      {item.name}
    </Link>
  );
};

// Main Navigation Component
const Header = ({ isScrolled }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerClasses = isScrolled
    ? 'fixed top-0 left-0 w-full z-50 shadow-lg backdrop-blur-md bg-white/90'
    : 'absolute top-0 left-0 w-full z-50 bg-transparent';

  const handleLinkClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Logo color is always dark blue for visibility on light pages.
  const logoColorClass = 'text-blue-600';

  return (
    <header className={headerClasses + ' h-20 transition-all duration-300'}>
      <div className="container mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0">
          <span className={`text-2xl font-black transition-colors duration-300 ${logoColorClass}`}>
            <Link href="/">
              <Image src="/logo.svg" alt="DataBridge Sites" width={215} height={50} />
            </Link>
          </span>
        </div>

        <nav className="hidden items-center space-x-8 md:flex">
          {navigationItems.map((item) => (
            <NavLink key={item.name} item={item} isScrolled={isScrolled} />
          ))}
          <button
            // Button is always solid blue for contrast
            className="btn-primary"
          >
            Contact us
          </button>
        </nav>

        <button
          // Mobile icon is always dark gray
          className={`rounded-xl p-2 text-gray-700 transition hover:bg-gray-100 md:hidden`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute left-0 top-20 w-full border-t border-gray-200 bg-white shadow-xl md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                item={item}
                isMobile={true}
                isScrolled={isScrolled}
                onClick={handleLinkClick}
              />
            ))}
            <button className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition duration-150 hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

// Main Layout Wrapper Component
const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const scrollThreshold = 400;
  const isScrolled = useScrollEffect(scrollThreshold);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isScrolled={isScrolled} />

      <div className="pt-20">{children}</div>

      <footer className="mt-10 bg-gray-800 p-12 text-white">
        <div className="container mx-auto text-center">
          <p className="text-sm opacity-80">
            &copy; {new Date().getFullYear()} Acme Digital. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LayoutWrapper;
