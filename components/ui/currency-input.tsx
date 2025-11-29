"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { formatRupiah, parseRupiah } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: number;
  onChange?: (value: number) => void;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("");

    React.useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(formatRupiah(value));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const numericValue = parseRupiah(inputValue);
      
      setDisplayValue(formatRupiah(numericValue));
      
      if (onChange) {
        onChange(numericValue);
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        className={cn("font-mono", className)}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
