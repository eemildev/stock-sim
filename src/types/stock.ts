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
