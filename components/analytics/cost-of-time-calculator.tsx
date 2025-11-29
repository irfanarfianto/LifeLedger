"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Clock, DollarSign } from "lucide-react";

export function CostOfTimeCalculator() {
  const [salary, setSalary] = useState<number>(0);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [hourlyRate, setHourlyRate] = useState<number | null>(null);

  const calculate = () => {
    if (salary <= 0 || hoursPerWeek <= 0) return;
    // Assume 4 weeks per month
    const totalHours = hoursPerWeek * 4;
    const rate = salary / totalHours;
    setHourlyRate(rate);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Harga Waktumu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Gaji Bulanan</Label>
          <CurrencyInput 
            placeholder="Rp 0" 
            onChange={(val) => setSalary(Number(val))}
          />
        </div>
        <div className="space-y-2">
          <Label>Jam Kerja per Minggu</Label>
          <Input 
            type="number" 
            value={hoursPerWeek} 
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
          />
        </div>
        <Button onClick={calculate} className="w-full">Hitung</Button>

        {hourlyRate !== null && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900 text-center">
            <p className="text-sm text-muted-foreground mb-1">Harga 1 jam kamu adalah</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Rp {hourlyRate.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
            </p>
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
              <p className="text-xs text-muted-foreground">
                Jika kamu scroll sosmed selama 2 jam, kamu "membuang" uang senilai 
                <span className="font-bold text-red-500 ml-1">
                  Rp {(hourlyRate * 2).toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                </span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
