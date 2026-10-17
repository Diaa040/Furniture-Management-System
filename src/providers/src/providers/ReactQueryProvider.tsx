'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  // بنعمل instance جديد للـ QueryClient مرة واحدة فقط
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // تعتبر البيانات جديدة لمدة 5 دقائق
            refetchOnWindowFocus: false, // يمنع إعادة طلب البيانات لمجرد التنقل بين شاشات المتصفح
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}