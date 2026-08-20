export type Stock = {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  mic_code: string;
  country: string;
  type: string;
  figi_code?: string;
  cfi_code?: string;
  isin?: string;
  cusip?: string;
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
