import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ToasterProvider } from '@/components/providers/toaster-provider';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { ourFileRouter } from '@/app/api/uploadthing/core';
import { extractRouterConfig } from 'uploadthing/server';
import { ConfettiProvider } from '@/components/providers/confetti-provider';
export const metadata: Metadata = {
  title: 'LMS platform',
  description: 'LMS platform for students and teachers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <ConfettiProvider />
        <ToasterProvider />
        <NextSSRPlugin
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
