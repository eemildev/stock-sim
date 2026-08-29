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
      params.set("page", "1"); // Reset to first page on new search
    } else {
      params.delete("query");
      params.set("page", "1"); // Reset to first page on clear search
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <InputGroup className="w-full">
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
