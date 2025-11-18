import type { Metadata } from 'next';
import { Geist_Mono, Open_Sans } from 'next/font/google';
import '@/styles/globals.scss';
import LayoutWrapper from '@/components/LayoutWrapper';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DataBridge Sites',
  description:
    'DataBridge Sites provides managed cloud and colocation in our industry-leading data centers to keep your hybrid infrastructure secure.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} ${geistMono.variable} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
