"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { StockLogo } from "@/components/stock-logo";

import {
  Card,
  CardAction,
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Values, Stock } from "@/types/stocks";

const chartConfig = {
  close: {
    label: "Close",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  values,
  stock,
}: {
  values: Values;
  stock: Stock | undefined;
}) {
  const [timeRange, setTimeRange] = React.useState("6M");

  const filteredData = React.useMemo(() => {
    // API data is newest -> oldest, so sort it chronologically.
    const data = [...values].sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
    );

    if (!data.length) {
      return [];
    }

    const referenceDate = new Date(data[data.length - 1].datetime);

    let startDate: Date;

    if (timeRange === "1Y") {
      startDate = new Date(referenceDate);
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else if (timeRange === "YTD") {
      startDate = new Date(referenceDate.getFullYear(), 0, 1);
    } else if (timeRange === "6M") {
      startDate = new Date(referenceDate);
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (timeRange === "30d") {
      startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - 30);
    } else {
      startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - 7);
    }

    return data.filter((item) => {
      const date = new Date(item.datetime);
      return date >= startDate && date <= referenceDate;
    });
  }, [timeRange, values]);

  return (
    <Card className="@container/card">
      <CardHeader>
    <div className="flex items-center gap-3">
      <StockLogo symbol={stock?.symbol ?? ""} />

      <div className="grid flex-1 gap-1">
        <CardTitle>{stock?.name ?? "Stock"}</CardTitle>

        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {stock?.exchange ?? "Stock price"} · {timeRange}
          </span>

          <span className="@[540px]/card:hidden">
            {stock?.exchange ?? "Stock price"}
          </span>
        </CardDescription>
      </div>
 </div>
        <CardAction>
          {/* Desktop */}
          <ToggleGroup
            value={[timeRange]}
            onValueChange={(value) => {
              if (value.length > 0) {
                setTimeRange(value[0]);
              }
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>

            <ToggleGroupItem value="YTD">YTD</ToggleGroupItem>

            <ToggleGroupItem value="6M">6M</ToggleGroupItem>

            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>

            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>

          {/* Mobile */}
          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (value) {
                setTimeRange(value);
              }
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select time range"
            >
              <SelectValue placeholder="6 months" />
            </SelectTrigger>

            <SelectContent className="rounded-xl">
              <SelectItem value="1Y" className="rounded-lg">
                1 year
              </SelectItem>

              <SelectItem value="YTD" className="rounded-lg">
                Year to date
              </SelectItem>

              <SelectItem value="6M" className="rounded-lg">
                6 months
              </SelectItem>

              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>

              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
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
                  stopOpacity={0.1}
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
                    return [`$${Number(value)}`, " Close"];
                  }}
                />
              }
            />

            <Area
              dataKey="close"
              type="natural"
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
