"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { BuyStockForm } from "./buy-stock-form";
import { SellStockForm } from "./sell-stock-form";
import { Quote, Stock } from "@/types/stocks";
import { PortfolioWithHoldings } from "@/types/portfolios";

type TransactionMode = "buy" | "sell";

export function StockCheckout({
  quote,
  stock,
  portfolios,
  mode = "buy",
}: {
  quote: Quote;
  stock: Stock;
  portfolios: PortfolioWithHoldings[];
  mode?: TransactionMode;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!quote.c || !quote.d || !quote.dp) {
    return <Button disabled>{mode === "buy" ? "Buy" : "Sell"} Stock</Button>;
  }

  const triggerLabel = mode === "buy" ? "Buy Stock" : "Sell Stock";
  const triggerVariant = mode === "buy" ? "default" : "destructive";

  const checkOutMode = (
    <>
      {mode === "buy" ? (
        <BuyStockForm
          quote={quote}
          stock={stock}
          portfolios={portfolios}
          setOpen={setOpen}
        />
      ) : (
        <SellStockForm
          quote={quote}
          stock={stock}
          portfolios={portfolios}
          setOpen={setOpen}
        />
      )}
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={<Button variant={triggerVariant} className="w-[50%]">{triggerLabel}</Button>}
        />
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            {" "}
            <DialogTitle>{stock.name}</DialogTitle>
            <DialogTitle>${quote.c}</DialogTitle>
            <DialogDescription
              className={quote.dp > 0 ? "text-green-500" : "text-red-500"}
            >
              {quote.dp.toPrecision(3)}%
            </DialogDescription>
          </DialogHeader>
          {checkOutMode}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={<Button variant={triggerVariant} className="w-[50%]">{triggerLabel}</Button>}
      />
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{stock.name}</DrawerTitle>
          <DrawerTitle>${quote.c}</DrawerTitle>
          <DrawerDescription
            className={quote.dp > 0 ? "text-green-500" : "text-red-500"}
          >
            {quote.dp.toPrecision(3)}%
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
           {checkOutMode}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
