"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Props = {
  className?: string
  options: {
    value: string
    ui: React.ReactNode
    keywords?: string[]
  }[]
  placeholder?: string
  searchPlaceholder?: string
  value?: string
  onChange?: (value: string) => void
}

export const Combobox: React.FC<Props> = ({
  className,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  value: _value,
}) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(_value ?? "")

  React.useEffect(() => {
    onChange?.(value)
  }, [onChange, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between gap-2", className)}
        >
          {value
            ? options.find((option) => option.value.toLowerCase() === value.toLowerCase())?.ui
            : placeholder}
          <CaretSortIcon className="h-4 w-4 min-w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          filter={(value, search) => {
            const option = options.find(
              (option) => option.value.toLowerCase() === value.toLowerCase()
            )
            if (!option) return 0
            if (option.keywords) {
              for (const keyword of option.keywords) {
                if (keyword.toLowerCase().includes(search.toLowerCase())) return 1
              }
            }
            return 0
          }}
        >
          <CommandInput placeholder={searchPlaceholder ?? "Search..."} className="h-9" />
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  setValue(currentValue)
                  setOpen(false)
                }}
              >
                {option.ui}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
