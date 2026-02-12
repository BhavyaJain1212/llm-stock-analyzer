import yfinance as yf
import time
from typing import Dict, Optional, List
from datetime import datetime

REQUEST_DELAY = 1.0
MAX_RETRIES = 3
RETRY_DELAY = 5

def get_stock_data(ticker: str) -> Optional[Dict]: # the function may return either a dictionary or nothing
    """
    Fetch comprehensive stock data for a given ticker symbol.
    
    Args:
        ticker: Stock symbol (e.g., 'AAPL', 'GOOGL', 'RELIANCE.NS')
    
    Returns:
        Dictionary containing stock data, or None if ticker is invalid
    
    Example:
        >>> data = get_stock_data("AAPL")
        >>> print(data['name'], data['price'])
        Apple Inc. 175.50
    """
    try:
        # Create ticker object
        stock = yf.Ticker(ticker.upper())
        
        info = stock.info

        price = info.get('regularMarketPrice')
        symbol = info.get('symbol')
        quote_type = info.get("quoteType")

        if price is None or symbol is None or quote_type is None:
            return None
        
            # Build comprehensive data dictionary
        info_val_dict =  {
            # Basic Info
            "symbol": ticker.upper(),
            "name": info.get("longName") or info.get("shortName", "Unknown"),
            "sector": info.get("sector", "N/A"),
            "industry": info.get("industry", "N/A"),
            "country": info.get("country", "N/A"),
            "website": info.get("website", "N/A"),
                
            # Price Data
            "price": price,
            "currency": info.get("currency", "USD"),
            "change": info.get("regularMarketChange", 0), # default value of the key is 0
            "change_percent": info.get("regularMarketChangePercent", 0),
            "previous_close": info.get("previousClose", 0),
            "open": info.get("regularMarketOpen", 0),
            "day_high": info.get("dayHigh", 0),
            "day_low": info.get("dayLow", 0),
                
            # Volume
            "volume": info.get("regularMarketVolume", 0),
            "avg_volume": info.get("averageVolume", 0),
            "avg_volume_10d": info.get("averageVolume10days", 0),
                
            # Market Data
            "market_cap": info.get("marketCap", 0),
            "enterprise_value": info.get("enterpriseValue", 0),
            
            # Valuation Metrics
            "pe_ratio": info.get("trailingPE", "N/A"),
            "forward_pe": info.get("forwardPE", "N/A"),
            "peg_ratio": info.get("pegRatio", "N/A"),
            "price_to_book": info.get("priceToBook", "N/A"),
            "price_to_sales": info.get("priceToSalesTrailing12Months", "N/A"),
                
            # 52 Week Data
            "week_52_high": info.get("fiftyTwoWeekHigh", 0),
            "week_52_low": info.get("fiftyTwoWeekLow", 0),
            "week_52_change": info.get("52WeekChange", 0),
                
            # Moving Averages
            "ma_50": info.get("fiftyDayAverage", 0),
            "ma_200": info.get("twoHundredDayAverage", 0),
                
            # Dividends
            "dividend_yield": info.get("dividendYield", 0),
            "dividend_rate": info.get("dividendRate", 0),
            "ex_dividend_date": info.get("exDividendDate", "N/A"),
            "payout_ratio": info.get("payoutRatio", 0),
                
            # Financials
            "revenue": info.get("totalRevenue", 0),
            "gross_profit": info.get("grossProfits", 0),
            "ebitda": info.get("ebitda", 0),
            "net_income": info.get("netIncomeToCommon", 0),
            "eps": info.get("trailingEps", "N/A"),
            "forward_eps": info.get("forwardEps", "N/A"),
                
            # Margins
            "profit_margin": info.get("profitMargins", 0),
            "operating_margin": info.get("operatingMargins", 0),
            "gross_margin": info.get("grossMargins", 0),
                
            # Balance Sheet
            "total_cash": info.get("totalCash", 0),
            "total_debt": info.get("totalDebt", 0),
            "debt_to_equity": info.get("debtToEquity", "N/A"),
            "current_ratio": info.get("currentRatio", "N/A"),
                
            # Shares
            "shares_outstanding": info.get("sharesOutstanding", 0),
            "float_shares": info.get("floatShares", 0),
            "short_ratio": info.get("shortRatio", "N/A"),
                
            # Analyst Targets
            "target_high": info.get("targetHighPrice", 0),
            "target_low": info.get("targetLowPrice", 0),
            "target_mean": info.get("targetMeanPrice", 0),
            "recommendation": info.get("recommendationKey", "N/A"),
            "num_analysts": info.get("numberOfAnalystOpinions", 0),
                
            # Metadata
            "exchange": info.get("exchange", "N/A"),
            "quote_type": info.get("quoteType", "N/A"),
            "fetch_time": datetime.now().isoformat(),
            "is_demo": False,  # Real data flag
            }
        
        return info_val_dict
    
    except Exception as e:
        print('hello world')
        error_message = str(e)
        print(f"Error fetching data for {ticker}: {error_message}")

def get_30_day_history(ticker: str) -> Optional[Dict]:
    try:
        stock = yf.Ticker(ticker.upper())

        history = stock.history(period="1mo").reset_index()

        # chaing Date format from timestamp class to Y-m-d
        history["Date"] = history["Date"].dt.strftime("%Y-%m-%d")

        # creating list of dictionaries
        rows = history[["Date", "Open", "High", "Low", "Close", "Volume"]] \
            .to_dict(orient="records")

        return rows
    
    except Exception as e:
        print("Error: ", str(e))
        return None
