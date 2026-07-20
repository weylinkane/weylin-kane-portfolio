"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  Compass,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/holdings", label: "Holdings", icon: TrendingUp },
  { href: "/trade-journal", label: "Trade Journal", icon: BookOpen },
  { href: "/philosophy", label: "Philosophy", icon: Compass },
  { href: "/about", label: "About", icon: User },
  { href: "/admin", label: "Admin", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger toggle — only visible below lg */}
      <button
        type="button"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        onClick={() => setMobileOpen((v) => !v)}
        className="fixed left-4 top-4 z-50 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-primary lg:hidden"
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Backdrop on mobile when menu is open */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar itself */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-60 border-r border-border bg-background transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col px-5 py-8">
          {/* Brand */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="mb-10 block px-2"
          >
            <p className="text-sm font-medium tracking-tight text-primary">
              Weylin Kane
            </p>
            <p className="text-xs text-muted">Portfolio</p>
          </Link>

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-surface text-primary"
                      : "text-secondary hover:bg-surface hover:text-primary",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-auto px-2 pt-8">
            <p className="text-xs text-muted">v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
