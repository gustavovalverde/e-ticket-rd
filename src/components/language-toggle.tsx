"use client";

import { Languages } from "lucide-react";
import * as React from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mutation function for SWR
async function changeLocaleRequest(url: string, { arg }: { arg: string }) {
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale: arg }),
  });
}

const fetchLocale = async () => {
  const res = await fetch("/api/locale");
  const data = await res.json();
  return data.locale;
};

export function LanguageToggle() {
  const { data: currentLocale, isLoading } = useSWR("api/locale", fetchLocale);

  const { trigger, isMutating } = useSWRMutation(
    "/api/locale",
    changeLocaleRequest
  );

  const changeLanguage = async (locale: string) => {
    await trigger(locale);
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          disabled={isMutating || isLoading}
          className="border-accent/30 hover:border-accent/10 flex w-auto items-center gap-0 p-1.5 text-lg font-semibold shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl"
        >
          <Languages className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
          <span className="sr-only">Language selector</span>
          <span className="ml-2 text-xs">
            {isLoading ? "..." : (currentLocale || "").toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("es")}>
          Español
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("en")}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
