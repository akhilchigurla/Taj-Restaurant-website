'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu & Delivery' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md border-b border-border'
          : 'bg-background/80 backdrop-blur-sm'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl font-bold text-foreground">Taj</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Restaurant</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {loading ? null : user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
                  <UserIcon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border py-4 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'px-4 py-2.5 text-sm font-medium rounded-md transition-colors',
                    pathname === link.href
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 px-4">
                {loading ? null : user ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserIcon className="h-4 w-4" />
                      {user.email}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { signOut(); setOpen(false); }}>
                      <LogOut className="h-4 w-4 mr-1" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/register" onClick={() => setOpen(false)}>Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
