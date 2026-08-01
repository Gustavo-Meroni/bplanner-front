'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, PieChart, Target, X, LogOut } from 'lucide-react';
import { useUIStore } from '@/shared/store/use-ui-store';
import { useAuthStore } from '@/shared/store/use-auth-store';
import { ThemeToggle } from '@/shared/components/theme-toggle';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/gestao', label: 'Gestão de Gastos', icon: PieChart },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobileOpen, setMobileOpen } = useUIStore();

  const casal = useAuthStore((s) => s.casal);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleNav = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    // 1. Limpa o estado global do Zustand / localStorage
    clearAuth();

    // 2. Remove o cookie lido pelo Middleware
    document.cookie = 'bplanner-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    // 3. Fecha o menu no mobile e redireciona para a tela de Login
    setMobileOpen(false);
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/30 z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full p-5">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-primary to-primary/70 rounded-xl shadow-md text-primary-foreground">
                <Target size={22} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                B<span className="text-primary">Planner</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
              <button
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${active
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm border border-primary/20'
                      : 'text-muted-foreground hover:bg-primary/10 hover:text-primary font-medium'
                    }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 2}
                    className={active ? 'text-primary-foreground' : 'text-muted-foreground'}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-auto space-y-3">
            <div className="p-4 bg-muted rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                  {casal?.nome?.slice(0, 2).toUpperCase() ?? 'BP'}
                </div>
                <div className="text-sm font-semibold text-foreground truncate">
                  {casal?.nome ?? 'Casal Planejador'}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-xs font-bold text-muted-foreground">STATUS: POUPANDO</span>
              </div>
            </div>

            {/* Botão de Sair */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-colors"
            >
              <LogOut size={18} />
              Sair da Conta
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}