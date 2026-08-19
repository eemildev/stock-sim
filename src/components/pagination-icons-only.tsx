"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const PAGE_SIZES = [10, 25, 50, 100];

export function PaginationIconsOnly({
  page,
  outputsize,
  totalCount,
}: {
  page: number;
  outputsize: number;
  totalCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalCount / outputsize);
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  const buildHref = (params: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => sp.set(k, v));
    return `${pathname}?${sp.toString()}`;
  };

  const handleSizeChange = (value: string | null) => {
    if (!value) return;
    router.push(buildHref({ outputsize: value, page: "1" }));
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        <Select value={outputsize.toString()} onValueChange={handleSizeChange}>
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={isFirstPage ? "#" : buildHref({ page: (page - 1).toString() })}
              className={isFirstPage ? "pointer-events-none opacity-50" : ""}
              aria-disabled={isFirstPage}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={isLastPage ? "#" : buildHref({ page: (page + 1).toString() })}
              className={isLastPage ? "pointer-events-none opacity-50" : ""}
              aria-disabled={isLastPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}