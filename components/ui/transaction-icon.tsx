import { ArrowUpRight, ArrowDownRight, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionIconProps {
  type: "income" | "expense" | "transfer";
  className?: string;
}

export function TransactionIcon({ type, className }: TransactionIconProps) {
  let icon, colorClass;

  if (type === 'income') {
    icon = <ArrowUpRight className="h-4 w-4" />;
    colorClass = "bg-green-100 text-green-600 dark:bg-green-900/20";
  } else if (type === 'transfer') {
    icon = <ArrowLeftRight className="h-4 w-4" />;
    colorClass = "bg-blue-100 text-blue-600 dark:bg-blue-900/20";
  } else {
    icon = <ArrowDownRight className="h-4 w-4" />;
    colorClass = "bg-red-100 text-red-600 dark:bg-red-900/20";
  }

  return (
    <div className={cn("flex h-9 w-9 items-center justify-center rounded-full shrink-0", colorClass, className)}>
      {icon}
    </div>
  );
}
