'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, PieChart, Target, X, LogOut, User } from 'lucide-react';
import { useUIStore } from '@/shared/store/use-ui-store';
import { useAuthStore } from '@/shared/store/use-auth-store';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { Button } from '@/shared/components/ui/Button'; // Importando nosso primitivo!
import { cn } from '@/lib/utils';

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
    clearAuth();
    document.cookie = 'bplanner-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setMobileOpen(false);
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden transition-all"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header & Logo */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Target size={24} strokeWidth={2.5} />
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
                className="lg:hidden p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex-1">
            {/* Section Label (Inspirado na referência) */}
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 pl-4">
              Navegação
            </p>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNav(item.href)}
                    className={cn(
                      'w-full flex items-center gap-4 px-4 py-3.5 rounded-[1rem] transition-all duration-200 text-sm font-semibold',
                      active
                        ? 'bg-primary/10 text-primary' // Active state: Dourado sutil
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground' // Inactive: Hover grafite
                    )}
                  >
                    <Icon
                      size={20}
                      strokeWidth={active ? 2.5 : 2}
                      className={active ? 'text-primary' : 'text-muted-foreground'}
                    />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer Profile Pill (Inspirado na referência) */}
          <div className="mt-auto pt-6 border-t border-border/30">
            <div className="flex items-center justify-between p-2 rounded-[2rem] border border-border bg-background/50 hover:bg-muted/50 transition-colors">

              {/* User Info */}
              <div className="flex items-center gap-3 overflow-hidden pl-2 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <User size={16} strokeWidth={2.5} />
                </div>
                {/* flex-1 e min-w-0 garantem que o texto ocupe o máximo de espaço dinamicamente */}
                <div className="flex flex-col text-left flex-1 min-w-0 pr-2">
                  <span className="text-sm font-bold text-foreground truncate block w-full">
                    {casal?.nome ?? 'Casal'}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Status: Poupando
                  </span>
                </div>
              </div>

              {/* Usando nosso primitivo Button para o Logout! */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-10 h-10 rounded-full p-0 flex-shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                aria-label="Sair"
              >
                <LogOut size={16} />
              </Button>
            </div>
          </div>       </div>
      </aside>
    </>
  );
}