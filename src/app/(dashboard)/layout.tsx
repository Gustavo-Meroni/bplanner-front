'use client';

import { Sidebar } from '@/shared/components/ui/Sidebar';
import { MobileHeader } from '@/shared/components/ui/MobileHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background font-sans text-foreground overflow-hidden selection:bg-primary/20">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
