import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import '../client/src/index.css';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Stupid Simple Apps - Design Agency',
  description: 'A design agency highlighting simplicity and affordability',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}