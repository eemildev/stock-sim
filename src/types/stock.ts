export type Stock = {
  id: number;
  symbol: string;
  name: string;
  currency: string | null;
  exchange: string | null;
  micCode: string | null;
  country: string | null;
  type: string | null;
  figiCode: string | null;
  cfiCode: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
export type TimeSeries = {
  meta: {
    "symbol": string,
    "currency": string,
    "exchangeTimezone": string,
    "exchange": string,
    "micCode": string,
    "type": string
  }
  values: Values;

}
export type Values = [
  {
    "datetime": string,
    "open": string,
    "high": string,
    "low": string,
    "close": string,
    "volume": string
  },
]

export type Quote = {
  "c": number, // Current price
  "d": number, // Change
  "dp": number, // Percent change
  "h": number, // High price of the day
  "l": number, // Low price of the day
  "o": number, // Open price of the day
  "pc": number, // Previous close price
  "t": number // Timestamp
}
