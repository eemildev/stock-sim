import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

export function HoldingItem({
  holdingsValue,
  profit,
  percentage,
}: {
  holdingsValue: number;
  profit: number;
  percentage: number;
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <Item variant="outline" role="listitem">
        <ItemContent>
          <ItemTitle className="line-clamp-1">Holding value</ItemTitle>
          <ItemDescription className="text-2xl text-primary">
            {" "}
            ${holdingsValue.toFixed(0)}
          </ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center">
          <ItemDescription
            className={
              percentage < 0 ? "text-xl text-red-500" : "text-xl text-green-500"
            }
          >
            {percentage.toFixed(2)}% ({profit.toFixed(2)})
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}
