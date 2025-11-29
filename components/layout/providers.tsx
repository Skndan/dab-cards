'use client';
import React, { Suspense } from 'react';

import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Loader } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "next-themes";
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';
// import Metrics from '@/app/(metrics)';
// import ChatWootWidget from '@/app/(metrics)/chat-woot';

export default function Providers({
  children
}: {
  children: React.ReactNode;
}) {

  const queryClient = new QueryClient()
  return (
    <>
      <NextTopLoader showSpinner={false} color="#22c55e" />
      {/* <SessionProvider> */}
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <Metrics /> */}
          {/* <ChatWootWidget /> */}
          <Toaster position="top-center" />
          <Suspense fallback={<div className="grid h-screen place-items-center">
            <Loader className="mr-3 size-5 animate-spin" />
          </div>}>
            {children}
          </Suspense>
          <TailwindIndicator />
        </ThemeProvider>
      </QueryClientProvider>
      {/* </SessionProvider> */}
    </>
  );
}
