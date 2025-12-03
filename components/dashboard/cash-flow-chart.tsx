"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCashFlowData } from "@/lib/actions/analytics";

import { formatCompactNumber } from "@/lib/utils/currency";

interface CashFlowData {
  date: string;
  income: number;
  expense: number;
}

interface CashFlowChartProps {
  data: CashFlowData[]; // Initial data
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              {/* Date label is already formatted in data */}
            </span>
          </div>
        </div>
        <div className="grid gap-2 mt-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-medium text-muted-foreground">
                {entry.name}:
              </span>
              <span className="text-xs font-bold font-mono">
                Rp {entry.value.toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function CashFlowChart({ data: initialData }: CashFlowChartProps) {
  const [data, setData] = useState<CashFlowData[]>(initialData);
  const [range, setRange] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const newData = await getCashFlowData(range);
        // @ts-ignore - Mismatch in type definition between server action return and component state
        setData(newData);
      } catch (error) {
        console.error("Failed to fetch cash flow data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Skip first render if initialData matches default range (optimization)
    // But since we don't know if initialData is monthly, we can just fetch or rely on initialData for first render.
    // For simplicity, we fetch when range changes.
    // To avoid double fetch on mount, we can check if range changed from default.
    // However, initialData is passed from server which is "monthly" by default.
    if (range !== "monthly") {
      fetchData();
    } else {
      // Reset to initial data if switching back to monthly (optional, or just fetch)
      // Actually, better to just fetch to ensure fresh data or keep it simple.
      // Let's just fetch to be consistent, or if we want to use initialData for monthly:
      // setData(initialData); // Only works if initialData is guaranteed to be monthly and fresh.
      // Let's just fetch.
      fetchData();
    }
  }, [range]);

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Arus Kas</CardTitle>
        <Select value={range} onValueChange={(v: any) => setRange(v)}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder="Pilih Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Harian</SelectItem>
            <SelectItem value="weekly">Mingguan</SelectItem>
            <SelectItem value="monthly">Bulanan</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
              <div className="text-xs text-muted-foreground">Memuat data...</div>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="date" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCompactNumber(value)}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                name="Pemasukan" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                name="Pengeluaran" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
