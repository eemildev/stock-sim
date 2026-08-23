"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  addPortfolioAction,
  type AddPortfolioState,
} from "@/actions/portfolios";

const initialState: AddPortfolioState = {};

export function PortfolioForm() {
  const [state, formAction, isPending] = useActionState(
    addPortfolioAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Portfolio name</Label>

        <Input
          id="name"
          name="name"
          type="text"
          placeholder="My Portfolio"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cashBalance">Cash balance</Label>

        <Input
          id="cashBalance"
          name="cashBalance"
          type="number"
          min="0"
          step="0.01"
          placeholder="10000.00"
          required
        />
      </div>

      {state.error && (
        <p className="text-sm font-medium text-destructive">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="text-sm font-medium text-green-600">
          Portfolio added successfully.
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Adding..." : "Add Portfolio"}
      </Button>
    </form>
  );
}