import yfinance as yf
import pandas as pd

def fetch_stock_history(symbol: str, period="1y"):
    """
    Fetch historical OHLC data for NSE stock
    """
    ticker = f"{symbol}.NS"
    df = yf.download(ticker, period=period, progress=False)

    if df.empty:
        raise ValueError(f"No data for {symbol}")

    return df
