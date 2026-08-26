import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", moneyIn: 31000, moneyOut: 16000, balance: 28000 },
  { month: "Feb", moneyIn: 28000, moneyOut: 34000, balance: 22000 },
  { month: "Mar", moneyIn: 18000, moneyOut: 14000, balance: 26000 },
  { month: "Apr", moneyIn: 22000, moneyOut: 40000, balance: 18000 },
  { month: "May", moneyIn: 13000, moneyOut: 25000, balance: 34000 },
  { month: "Jun", moneyIn: 22000, moneyOut: 14000, balance: 31000 },
  { month: "Jul", moneyIn: 33000, moneyOut: 37000, balance: 27000 },
  { month: "Aug", moneyIn: 38000, moneyOut: 16000, balance: 35000 },
  { month: "Sep", moneyIn: 49000, moneyOut: 36000, balance: 41000 },
  { month: "Oct", moneyIn: 39000, moneyOut: 30000, balance: 47000 },
  { month: "Nov", moneyIn: 29000, moneyOut: 37000, balance: 43000 },
  { month: "Dec", moneyIn: 44000, moneyOut: 27000, balance: 50000 },
];

export function CashFlowChart() {
  const [view, setView] = useState<"income-expenses" | "cash-balance">(
    "income-expenses",
  );

  return (
    <section
      aria-labelledby="cash-flow-title"
      className="mb-4 overflow-hidden rounded-md border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
        <h2 id="cash-flow-title" className="text-sm font-semibold text-foreground">
          Cash Flow Trends
        </h2>
        <div
          className="flex rounded-md bg-muted p-1"
          role="group"
          aria-label="Cash flow chart view"
        >
          <button
            type="button"
            aria-pressed={view === "income-expenses"}
            onClick={() => setView("income-expenses")}
            className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
              view === "income-expenses"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Income vs Expenses
          </button>
          <button
            type="button"
            aria-pressed={view === "cash-balance"}
            onClick={() => setView("cash-balance")}
            className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
              view === "cash-balance"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cash balance
          </button>
        </div>
      </div>

      <div className="h-[260px] w-full sm:h-[290px]">
          <ResponsiveContainer width="100%" height="100%">
            {view === "income-expenses" ? (
              <BarChart data={data} margin={{ top: 20, right: 8, left: -16, bottom: 0 }} barGap={3}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                <ReferenceArea x1="Jan" x2="Jun" fill="hsl(var(--muted))" fillOpacity={0.55} label={{ value: "Historical", position: "insideTopRight", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}K`} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }} />
                <Bar name="Money In" dataKey="moneyIn" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} maxBarSize={22} />
                <Bar name="Money Out" dataKey="moneyOut" fill="#38a0d8" radius={[3, 3, 0, 0]} maxBarSize={22} />
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 20, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}K`} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Cash balance"]} />
                <Line name="Cash balance" type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
      </div>
    </section>
  );
}