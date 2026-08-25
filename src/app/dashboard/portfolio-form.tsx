"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import {
  addPortfolioAction,
  type AddPortfolioState,
} from "@/actions/portfolios";

const initialState: AddPortfolioState = {};

export function PortfolioForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const [state, formAction, isPending] = useActionState(
    addPortfolioAction,
    initialState,
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      toast.success("Portfolio added");
      router.refresh();
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state, router, setOpen]);

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
        <Field>
          <FieldLabel>Cash balance</FieldLabel>
          <Input
            id="cashBalance"
            name="cashBalance"
            type="number"
            min="1000"
            max="100000"
            step="1"
            defaultValue="100000"
            required
          />
          <FieldDescription>
            Enter the initial cash balance for the portfolio.
          </FieldDescription>
          <FieldError>{state.error}</FieldError>
        </Field>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Adding..." : "Add Portfolio"}
      </Button>
    </form>
  );
}
