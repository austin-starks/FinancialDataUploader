import axios, { AxiosInstance } from "axios";

type Year = `${number}${number}${number}${number}`;
type Month = `${number}${number}`;
type Day = `${number}${number}`;
type Datestring = `${Year}-${Month}-${Day}`;

export interface EodhdBulkFundamentalsResponse {
  ETF_Data?: Record<string, any>;
  General?: Record<string, any>;
  Highlights?: Record<string, any>;
  Valuation?: Record<string, any>;
  SharesStats?: Record<string, any>;
  Technicals?: Record<string, any>;
  SplitsDividends?: Record<string, any>;
  AnalystRatings?: Record<string, any>;
  Earnings?: Record<string, any>;
  Financials?: {
    Balance_Sheet?: {
      currency_symbol?: string;
      quarterly_last_0?: Record<string, any>;
      quarterly_last_1?: Record<string, any>;
      quarterly_last_2?: Record<string, any>;
      quarterly_last_3?: Record<string, any>;
      yearly_last_0?: Record<string, any>;
      yearly_last_1?: Record<string, any>;
      yearly_last_2?: Record<string, any>;
      yearly_last_3?: Record<string, any>;
    };
    Cash_Flow?: {
      currency_symbol?: string;
      quarterly_last_0?: Record<string, any>;
      quarterly_last_1?: Record<string, any>;
      quarterly_last_2?: Record<string, any>;
      quarterly_last_3?: Record<string, any>;
      yearly_last_0?: Record<string, any>;
      yearly_last_1?: Record<string, any>;
      yearly_last_2?: Record<string, any>;
      yearly_last_3?: Record<string, any>;
    };
    Income_Statement?: {
      currency_symbol?: string;
      quarterly_last_0?: Record<string, any>;
      quarterly_last_1?: Record<string, any>;
      quarterly_last_2?: Record<string, any>;
      quarterly_last_3?: Record<string, any>;
      yearly_last_0?: Record<string, any>;
      yearly_last_1?: Record<string, any>;
      yearly_last_2?: Record<string, any>;
      yearly_last_3?: Record<string, any>;
    };
  };
}

export interface EodhdFundamentalsResponse {
  ETF_Data?: {
    Holdings?: Record<string, { Code: string; "Assets_%": number }>;
  };
  Earnings?: {
    History?: any[];
    Annual?: any[];
  };
  Financials?: {
    Balance_Sheet?: {
      quarterly?: Record<Datestring, any>;
      yearly?: Record<Datestring, any>;
    };
    Cash_Flow?: {
      quarterly?: Record<Datestring, any>;
      yearly?: Record<Datestring, any>;
    };
    Income_Statement?: {
      quarterly?: Record<Datestring, any>;
      yearly?: Record<Datestring, any>;
    };
  };
}

export class EodhdClient {
  private readonly baseUrl: string = "https://eodhd.com/api";
  private readonly apiToken: string;
  private readonly client: AxiosInstance;

  constructor(apiToken: string = process.env.EOD_API_TOKEN!) {
    this.apiToken = apiToken;
    this.client = axios.create({
      baseURL: this.baseUrl,
      params: {
        api_token: this.apiToken,
        fmt: "json",
      },
    });
  }

  private buildUrl(endpoint: string): string {
    return `${endpoint}`;
  }

  async getFundamentals(ticker: string): Promise<EodhdFundamentalsResponse> {
    try {
      const url = this.buildUrl(`/fundamentals/${ticker}.US`);
      const { data } = await this.client.get(url);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch data for ${ticker}: ${error.message}`);
      }
      throw error;
    }
  }

  async getBulkFundamentals(
    exchange: string,
    symbols: string[],
    offset?: number,
    limit: number = 500
  ): Promise<EodhdBulkFundamentalsResponse[]> {
    try {
      const symbolsParam = symbols.map((s) => `${s}.US`).join(",");
      const url = this.buildUrl(`/bulk-fundamentals/${exchange}`);
      const { data } = await this.client.get(url, {
        params: {
          symbols: symbolsParam,
          offset,
          limit,
          version: "1.2",
        },
      });
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
