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
  ChevronDown,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLogoutMutation, resolveImageUrl } from '@/store/api';
import { logout } from '@/store/authSlice';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { AuthLinks } from './AuthLinks';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogoutModal } from '@/components/auth/LogoutModal';

interface NavItem {
  label: string;
  href?: string;
  requiresAuth?: boolean;
  children?: { label: string; href: string; requiresAuth?: boolean }[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/home' },
  { label: 'Courses', href: '/courses' },
  {
    label: 'Learn',
    children: [
      { label: 'Gurmat Sangeet', href: '/gurmat-sangeet' },
      { label: 'Gurbani', href: '/gurbani' },
      { label: 'Videos', href: '/videos', requiresAuth: true },
      { label: 'Upload Video', href: '/upload-video', requiresAuth: true },
    ],
  },
  { label: 'Our Store', href: '/store', requiresAuth: true },
  {
    label: 'More',
    children: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
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

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
    }
    setDropdownOpen(false);
    setMobileOpen(false);
    setShowLogoutModal(false);
    dispatch(logout());
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

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) =>
            item.href ? (
              (!item.requiresAuth || isAuthenticated) && (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <div className="mx-auto mt-0.5 h-0.5 w-4 rounded-full bg-primary" />
                )}
              </Link>
              )
            ) : (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-primary">
                  {item.label}
                  <ChevronDown size={14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  {item.children
                    ?.filter(
                      (child) =>
                        !child.requiresAuth || isAuthenticated,
                    )
                    .map((child) => (
                      <DropdownMenuItem key={child.href} className="p-0">
                        <Link
                          href={child.href}
                          className={`block w-full rounded px-2 py-1.5 text-sm ${
                            isActive(child.href)
                              ? 'text-primary font-medium'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          )}
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
            {navItems.flatMap((item) =>
              item.children
                ? item.children
                    .filter(
                      (child) =>
                        !child.requiresAuth || isAuthenticated,
                    )
                    .map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                          isActive(child.href)
                            ? 'bg-muted text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-primary'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))
                : (!item.requiresAuth || isAuthenticated) && (
                    <Link
                      key={item.href}
                      href={item.href!}
                      onClick={() => setMobileOpen(false)}
                      className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                        isActive(item.href!)
                          ? 'bg-muted text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-primary'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ),
            )}
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
      <LogoutModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        user={user}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
      />
    </nav>
  );
}
