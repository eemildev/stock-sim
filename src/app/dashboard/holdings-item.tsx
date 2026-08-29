import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

export function HoldingsItem({
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
          <ItemTitle className="line-clamp-1">Portfolio holdings value</ItemTitle>
          <ItemDescription className="text-2xl">
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
            {profit > 0 ? "+" : ""}{percentage.toFixed(2)}% (${profit.toFixed(2)})
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}
