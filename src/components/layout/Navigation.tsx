"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Reservations" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-background">
      <nav className="mx-auto flex items-center justify-between px-4 py-4 md:px-8" aria-label="Main navigation">
        <Link href="/" className="text-lg font-semibold" aria-label="Coffee House home">
          Coffee House
        </Link>
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md border border-border p-2"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1">
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="block h-0.5 w-5 bg-foreground" />
          </div>
        </button>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/account/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/account/login">Sign up</Link>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-secondary">Hi, {user.name ?? user.email}</span>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </div>
          )}
        </div>
      </nav>
      {open && (
        <div className="md:hidden border-t border-border px-4 py-4 space-y-3">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-primary" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            {!user ? (
              <>
                <Button asChild variant="ghost" onClick={() => setOpen(false)}>
                  <Link href="/account/login">Log in</Link>
                </Button>
                <Button asChild onClick={() => setOpen(false)}>
                  <Link href="/account/login">Sign up</Link>
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={logout}>Logout</Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
