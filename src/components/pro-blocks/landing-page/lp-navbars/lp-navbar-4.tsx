"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/pro-blocks/logo";
import { Button } from "@/components/ui/button";

const MENU_ITEMS = [
  { label: "Application", href: "#" },
  { label: "Check Status", href: "#" },
  { label: "Help Guide", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Languages", href: "#" },
] as const;

interface NavMenuItemsProps {
  className?: string;
}

const NavMenuItems = ({ className }: NavMenuItemsProps) => (
  <div className={`flex flex-col gap-1 md:flex-row ${className ?? ""}`}>
    {MENU_ITEMS.map(({ label, href }) => (
      <Link key={label} href={href}>
        <Button variant="ghost" className="w-full md:w-auto">
          {label}
        </Button>
      </Link>
    ))}
  </div>
);

export function LpNavbar4() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className="border-border bg-background sticky isolate z-50 border-b px-6 py-2.5 md:fixed md:top-16 md:left-1/2 md:w-full md:max-w-3xl md:-translate-x-1/2 md:rounded-xl md:border md:p-3 md:shadow-lg">
      <div className="m-auto flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-6">
        <div className="flex justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Button
            variant="ghost"
            className="flex size-9 items-center justify-center md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden w-full flex-row justify-end gap-5 md:flex">
          <NavMenuItems />
          <Link href="#">
            <Button>Start E-Ticket</Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="flex w-full flex-col justify-end gap-5 pb-2.5 md:hidden">
            <NavMenuItems />
            <Link href="#">
              <Button className="w-full">Start E-Ticket</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
