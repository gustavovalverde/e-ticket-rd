"use client";

import {
  ChevronDown,
  Menu,
  Zap,
  Search,
  X,
  EllipsisVertical,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/pro-blocks/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export function AppShell1() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Mobile top bar component
  const MobileTopBar = () => (
    <div
      className={`bg-background flex h-14 items-center justify-between px-4 ${
        !isMenuOpen ? "border-border border-b" : ""
      }`}
    >
      <Button
        variant="ghost"
        onClick={toggleMenu}
        className="relative -ml-2 flex h-9 w-9 items-center justify-center [&_svg]:size-5"
      >
        <span
          className={`absolute transition-all duration-300 ${
            isMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
          }`}
        >
          <Menu />
        </span>
        <span
          className={`absolute transition-all duration-300 ${
            isMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
          }`}
        >
          <X />
        </span>
      </Button>

      <Logo className="absolute left-1/2 h-8 w-8 -translate-x-1/2 transform" />

      <div className="absolute right-4 flex items-center gap-3">
        <Button variant="ghost" className="h-9 w-9 p-0 [&_svg]:size-5">
          <Search className="text-muted-foreground" />
        </Button>
        <Button className="h-9 w-9 p-0 [&_svg]:size-5">
          <Zap />
        </Button>
      </div>
    </div>
  );

  // Navigation items component
  const NavItems = ({ isMobile = false }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

    const linkClasses = `font-medium ${isMobile ? "text-base" : "text-sm"} ${
      isMobile
        ? "text-muted-foreground"
        : "text-muted-foreground hover:bg-primary/5"
    } px-3 py-2 rounded-md`;

    return (
      <>
        <Link
          href="#"
          className={`${linkClasses} ${isMobile ? "text-primary" : "text-primary"}`}
        >
          Dashboard
        </Link>
        <Link href="#" className={`${linkClasses} flex gap-2`}>
          Orders
          <Badge className="flex h-5 w-5 items-center justify-center p-0 text-xs">
            2
          </Badge>
        </Link>
        <Link href="#" className={linkClasses}>
          Products
        </Link>
        <Link href="#" className={linkClasses}>
          Customers
        </Link>
        {isMobile ? (
          <div>
            <button
              onClick={toggleSettings}
              className={`w-full text-left ${linkClasses} flex items-center justify-between`}
            >
              Settings
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  isSettingsOpen ? "rotate-180 transform" : ""
                }`}
              />
            </button>
            {isSettingsOpen && (
              <div className="mt-1 ml-3 space-y-1">
                <Link
                  href="#"
                  className="text-muted-foreground block rounded-md px-3 py-2 text-base font-medium"
                >
                  General
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground block rounded-md px-3 py-2 text-base font-medium"
                >
                  Security
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground block rounded-md px-3 py-2 text-base font-medium"
                >
                  API
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground block rounded-md px-3 py-2 text-base font-medium"
                >
                  Advanced
                </Link>
              </div>
            )}
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className={`flex items-center ${linkClasses}`}>
              Settings <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>General</DropdownMenuItem>
              <DropdownMenuItem>Security</DropdownMenuItem>
              <DropdownMenuItem>API</DropdownMenuItem>
              <DropdownMenuItem>Advanced</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </>
    );
  };

  return (
    <div className="bg-background">
      {/* Desktop Navbar */}
      <nav className="border-border bg-background hidden h-16 border-b shadow-sm lg:block">
        <div className="container mx-auto flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-x-4">
            <Logo />
            <div className="flex items-center gap-x-1">
              <NavItems />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="text-muted-foreground h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>My Profile</DropdownMenuItem>
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <Separator className="my-1" />
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Zap className="h-4 w-4" /> Upgrade
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="lg:hidden">
        <MobileTopBar />
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="border-border bg-background border-b lg:hidden">
          <div className="flex flex-col">
            <div className="flex-grow overflow-y-auto p-2">
              <div className="flex flex-col">
                <NavItems isMobile={true} />
              </div>
            </div>
            <Separator />
            <div className="p-2">
              <div className="flex items-center space-x-3 p-2">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-muted-foreground text-sm">
                    hi@shadcndesign.com
                  </p>
                </div>
              </div>
              <div>
                <Link
                  href="#"
                  className="text-muted-foreground block rounded-md px-2 py-2 font-medium"
                >
                  My profile
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground block rounded-md px-2 py-2 font-medium"
                >
                  Account settings
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground block rounded-md px-2 py-2 font-medium"
                >
                  Billing
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground block rounded-md px-2 py-2 font-medium"
                >
                  Sign out
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="border-border bg-background border-b py-4 md:py-6">
        <div className="container mx-auto flex flex-col gap-6 px-4 lg:px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/docs/components">
                  Projects
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Project alpha</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Project alpha
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Manage your project&apos;s details such as name, image,
                description and settings.
              </p>
            </div>
            <div className="flex flex-row-reverse justify-end gap-2 md:flex-row">
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>View</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button variant="outline" className="hidden lg:inline-flex">
                Share
              </Button>
              <Button variant="outline" className="hidden lg:inline-flex">
                View
              </Button>
              <Button variant="outline">Edit</Button>
              <Button>Publish</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex flex-col gap-6 px-4 py-6 lg:px-6">
        <div className="border-border bg-muted text-muted-foreground w-full rounded-md border border-dashed p-6 text-center">
          Replace this div with your content
        </div>
      </div>
    </div>
  );
}
