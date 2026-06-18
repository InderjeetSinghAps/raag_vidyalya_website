'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  User,
  BookOpen,
  LogOut,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLogoutMutation, resolveImageUrl } from '@/store/api';
import { logout } from '@/store/authSlice';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AuthLinks } from './AuthLinks';
import { ThemeToggle } from '@/components/theme-toggle';

const navLinks = [
  { label: 'Home', href: '/home' },
  { label: 'Courses', href: '/courses' },
  { label: 'Gurmat Sangeet', href: '/gurmat-sangeet' },
  { label: 'Gurbani', href: '/gurbani' },
  { label: 'Videos', href: '/videos' },
  { label: 'Our Store', href: '/store' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const glassDialog =
  'sm:max-w-md border-border/50 bg-card/95 backdrop-blur-2xl dark:border-white/[0.06] dark:bg-card/90 [&>button]:text-muted-foreground';

export function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  const dispatch = useAppDispatch();
  const [logoutApi, { isLoading: isLoggingOut }] =
    useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  console.log(
    '\n===================== 🟢 user =====================',
  );
  console.log(user);
  console.log('=================================================\n');
  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      /* still clear local state */
    }
    setDropdownOpen(false);
    setMobileOpen(false);
    setShowLogoutModal(false);
    router.push('/home');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        mobileRef.current &&
        !mobileRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () =>
      document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (href: string) => {
    if (href === '/home') return pathname === '/home';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'var(--nav-gradient)',
        boxShadow: 'var(--nav-shadow)',
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-8">
        <Link href="/home" className="flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
            alt="Raag Vidyalaya"
          />
          <span className="hidden text-xl font-semibold text-foreground sm:inline">
            Raag Vidyalaya
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-all duration-300 ${
                isActive(link.href)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <div className="mx-auto mt-0.5 h-0.5 w-4 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {mounted ? (
            isAuthenticated && user ? (
              <div
                className="relative hidden md:block"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {user?.profileImage || user?.avatar ? (
                    <img
                      src={resolveImageUrl(
                        user?.profileImage || user?.avatar || '',
                      )}
                      key={user?.profileImage || user?.avatar}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="size-6 rounded-full object-cover"
                      onLoad={() =>
                        console.log('[NavbarAvatar] onLoad')
                      }
                      onError={(e) => {
                        console.log(
                          '[NavbarAvatar] onError',
                          (e.target as HTMLImageElement).src,
                        );
                        (e.target as HTMLImageElement).style.display =
                          'none';
                      }}
                    />
                  ) : (
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {(user?.name || user?.userName || '?')
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-dropdown-bg py-1 shadow-lg">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                    >
                      <User size={14} /> Profile
                    </Link>
                    <Link
                      href="/courses/my-courses"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                    >
                      <BookOpen size={14} /> My Courses
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:block">
                <AuthLinks />
              </div>
            )
          ) : (
            <div className="hidden md:block">
              <AuthLinks />
            </div>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center md:hidden"
          >
            {mobileOpen ? (
              <X className="size-5 text-foreground" />
            ) : (
              <Menu className="size-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          ref={mobileRef}
          className="border-t border-border md:hidden"
          style={{ background: 'var(--nav-gradient)' }}
        >
          <div className="flex flex-col gap-1 px-8 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-3">
              {mounted ? (
                isAuthenticated && user ? (
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <User size={14} /> Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                ) : (
                  <AuthLinks />
                )
              ) : (
                <AuthLinks />
              )}
            </div>
          </div>
        </div>
      )}
      <Dialog
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
      >
        <DialogContent className={glassDialog}>
          <DialogHeader>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-4 pt-2"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-red-500/10">
                <LogOut className="size-6 text-red-500" />
              </div>
              <div className="text-center">
                <DialogTitle className="text-lg text-foreground">
                  Log Out
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-muted-foreground">
                  Are you sure you want to log out? You&apos;ll need
                  to sign in again to access your account.
                </DialogDescription>
              </div>
            </motion.div>
          </DialogHeader>

          {user && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="mx-auto mt-2 flex w-full max-w-xs items-center gap-3 rounded-xl border border-border/50 bg-card/60 px-4 py-3 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03]"
            >
              {user.profileImage || user.avatar ? (
                <img
                  src={resolveImageUrl((user.profileImage || user.avatar)!)}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="size-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {(user.name || user.userName || '?')
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {user.name || user.userName}
                </p>
                <p className="truncate text-xs text-muted-foreground/60">
                  {user.email}
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="mt-4 flex gap-3"
          >
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
              className="flex-1"
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(239,68,68,0.25)] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(239,68,68,0.4)] hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Logging Out...
                </>
              ) : (
                'Log Out'
              )}
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
