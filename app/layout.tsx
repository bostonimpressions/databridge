import BotIdProvider from '@/components/BotIdProvider';
import type { Metadata } from 'next';
import { defaultMetadata } from '@/lib/seo';

import { Inter, Share_Tech } from 'next/font/google';
import '@/styles/globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import { getServicePages } from '@/lib/getServicePages';
import { getIndustryPages } from '@/lib/getIndustryPages';

const inter = Inter({
  variable: '--font-open-sans',
  subsets: ['latin'],
});

const shareTech = Share_Tech({
  weight: '400',
  variable: '--font-share-tech',
  subsets: ['latin'],
});

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch pages for navigation
  const [servicePages, industryPages] = await Promise.all([getServicePages(), getIndustryPages()]);

  return (
    <html lang="en">
      <body className={`${inter.variable} ${shareTech.variable} antialiased`}>
      <BotIdProvider>
        <LayoutWrapper servicePages={servicePages} industryPages={industryPages}>
          {children}
        </LayoutWrapper>
      </BotIdProvider>

      </body>
    </html>
  );
}
