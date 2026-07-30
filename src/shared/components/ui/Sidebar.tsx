'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, PieChart, Target, X } from 'lucide-react';
import { useUIStore } from '@/shared/store/use-ui-store';
import { useAuthStore } from '@/shared/store/use-auth-store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/gestao', label: 'Gestão de Gastos', icon: PieChart },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobileOpen, setMobileOpen } = useUIStore();
  const casal = useAuthStore((s) => s.casal);

  const handleNav = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-5">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#253D2C] to-[#2E6F40] rounded-xl shadow-md text-white">
                <Target size={22} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#253D2C]">
                B<span className="text-[#2E6F40]">Planner</span>
              </h2>
            </div>
            <button
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    active
                      ? 'bg-[#2E6F40] text-white font-semibold shadow-sm border border-[#253D2C]/10'
                      : 'text-slate-500 hover:bg-[#CFFFDC]/50 hover:text-[#253D2C] font-medium'
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 2}
                    className={active ? 'text-white' : 'text-slate-400'}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-auto">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#CFFFDC] flex items-center justify-center text-[#2E6F40] font-bold text-xs">
                  {casal?.nome?.slice(0, 2).toUpperCase() ?? 'GR'}
                </div>
                <div className="text-sm font-semibold text-[#253D2C]">
                  {casal?.nome ?? 'Casal Planejador'}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-bold text-slate-500">STATUS: POUPANDO</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
