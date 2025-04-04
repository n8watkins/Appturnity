import { Inter } from 'next/font/google';
import { Toaster } from './components/ui/toaster';
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
      <head>
        {/* Script for handling anchor links with smooth scrolling */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle smooth scrolling for anchor links when URL changes
              document.addEventListener('DOMContentLoaded', () => {
                // If there's a hash in the URL when page loads, scroll to it smoothly
                if (window.location.hash) {
                  const targetId = window.location.hash.substring(1);
                  const element = document.getElementById(targetId);
                  
                  if (element) {
                    setTimeout(() => {
                      const offset = 80; // Header height offset
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                      });
                    }, 100);
                  }
                }
              });
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}