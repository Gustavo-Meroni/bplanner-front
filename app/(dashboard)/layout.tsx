'use client';

import { Sidebar } from '@/shared/components/ui/Sidebar';
import { MobileHeader } from '@/shared/components/ui/MobileHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#f4fcf6] font-sans text-[#253D2C] overflow-hidden selection:bg-[#CFFFDC]">
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
