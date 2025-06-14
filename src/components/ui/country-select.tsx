"use client";

import { getEmojiFlag, countries, type TCountryCode } from "countries-list";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import type { AnyFieldApi } from "@tanstack/react-form";

interface CountrySelectProps {
  field: AnyFieldApi;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface CountryOption {
  code: TCountryCode;
  name: string;
  flag: string;
}

// Convert countries list to array with flag emojis
const countryOptions: CountryOption[] = Object.entries(countries)
  .map(([code, country]) => ({
    code: code as TCountryCode,
    name: country.name,
    flag: getEmojiFlag(code as TCountryCode),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function CountrySelect({
  field,
  placeholder = "Select country...",
  disabled = false,
  className,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Get current value from field
  const currentValue = field.state.value || "";

  // Find selected country by name (since we store country names as strings)
  const selectedCountry = countryOptions.find(
    (country) => country.name === currentValue
  );

  // Filter countries based on search
  const filteredCountries = countryOptions.filter(
    (country) =>
      country.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      country.code.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Handle country selection
  const handleSelect = (countryName: string) => {
    field.handleChange(countryName);
    setOpen(false);
    setSearchValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "min-h-[44px] w-full justify-between text-base", // Match FormField mobile styling
            !selectedCountry && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            {selectedCountry ? (
              <>
                <span className="text-lg" role="img" aria-label="flag">
                  {selectedCountry.flag}
                </span>
                <span className="truncate">{selectedCountry.name}</span>
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 opacity-50" />
                <span>{placeholder}</span>
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder="Search countries..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="h-12"
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {filteredCountries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.name}
                  onSelect={() => handleSelect(country.name)}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <span className="text-lg" role="img" aria-label="flag">
                    {country.flag}
                  </span>
                  <span className="flex-1">{country.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {country.code}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedCountry?.code === country.code
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
