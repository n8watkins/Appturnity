import { Inter } from 'next/font/google';
import { Toaster } from '../client/src/components/ui/toaster';
import { QueryProvider } from './providers';
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
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}