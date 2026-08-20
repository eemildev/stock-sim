"use client";

import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface StockSearchProps {
  results: number;
}
export function StockSearch({ results }: StockSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
    const [value, setValue] = useState(searchParams.get('query')?.toString() || "");

  function handleSearch(term: string) {
    setValue(term);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput
        placeholder="Search..."
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        value={value}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">{results} results</InputGroupAddon>
    </InputGroup>
  );
}
