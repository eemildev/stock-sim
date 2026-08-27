"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { Values, Stock} from "@/types/stocks";

const chartConfig = {
  close: {
    label: "Close",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  values,
  stock,
}: {
  values: Values;
  stock: Stock | undefined;
}) {
  const [timeRange, setTimeRange] = useState("6M");

  const filteredData = useMemo(() => {
    // API data is newest -> oldest, so reverse it for the chart.
    const data = [...values].sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
    );

    const referenceDate = new Date(
      data[data.length - 1]?.datetime ?? new Date(),
    );

    let daysToSubtract = 30;

    if (timeRange === "1Y") {
      daysToSubtract = 365;
    } else if (timeRange === "YTD") {
      const startOfYear = new Date(referenceDate.getFullYear(), 0, 1);
      daysToSubtract = Math.floor(
        (referenceDate.getTime() - startOfYear.getTime()) /
          (1000 * 60 * 60 * 24),
      );
    } else if (timeRange === "6M") {
      daysToSubtract = 182; // Approximate number of days in 6 months
    } else if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return data.filter((item) => {
      const date = new Date(item.datetime);
      return date >= startDate && date <= referenceDate;
    });
  }, [timeRange, values]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{stock?.name}</CardTitle>
          <CardDescription>{stock?.exchange}</CardDescription>
        </div>

        <Select
          value={timeRange}
          onValueChange={(value) => {
            if (value !== null) {
              setTimeRange(value);
            }
          }}
        >
          <SelectTrigger
            className="hidden w-40 rounded-lg sm:ml-auto sm:flex"
            aria-label="Select time range"
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent className="rounded-xl">
            <SelectItem value="1Y" className="rounded-lg">
              1Y
            </SelectItem>

            <SelectItem value="YTD" className="rounded-lg">
              YTD
            </SelectItem>

            <SelectItem value="6M" className="rounded-lg">
              6M
            </SelectItem>

            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>

            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <AreaChart
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
              top: 8,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillClose" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-close)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-close)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={["dataMin - 5", "dataMax + 5"]}
              tickFormatter={(value) =>
                value.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })
              }
            />

            <XAxis
              dataKey="datetime"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);

                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  formatter={(value) => {
                    return [`$${Number(value).toFixed(2)}`, " Close"];
                  }}
                />
              }
            />

            <Area
              dataKey="close"
              type="monotone"
              fill="url(#fillClose)"
              stroke="var(--color-close)"
              strokeWidth={2}
              activeDot={{
                r: 4,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
