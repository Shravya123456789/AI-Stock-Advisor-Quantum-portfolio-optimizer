import sys
from pathlib import Path
from datetime import datetime

# --- Add project root to Python path ---
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

import pandas as pd
import yfinance as yf

from utils.path_config import PRICE_DATA_DIR, METADATA_DIR


START_DATE = "2000-01-01"
END_DATE = datetime.today().strftime("%Y-%m-%d")


def load_stock_universe() -> pd.DataFrame:
    universe_path = METADATA_DIR / "stock_universe.csv"
    return pd.read_csv(universe_path)


def fetch_price_data(symbol: str) -> pd.DataFrame:
    """
    Robust Yahoo Finance fetch with fallback handling.
    """
    try:
        data = yf.download(
            tickers=symbol,
            start=START_DATE,
            end=END_DATE,
            group_by="column",
            auto_adjust=False,
            progress=False,
            threads=False  # 🔥 IMPORTANT: avoids NoneType bug
        )
    except Exception as e:
        raise RuntimeError(f"Yahoo fetch failed for {symbol}: {e}")

    # Defensive checks
    if data is None or len(data) == 0:
        raise ValueError(f"No price data found for {symbol}")

    if isinstance(data.columns, pd.MultiIndex):
        data.columns = data.columns.get_level_values(0)

    data.reset_index(inplace=True)
    data["Symbol"] = symbol

    return data



def save_price_data(df: pd.DataFrame, symbol: str) -> None:
    file_path = PRICE_DATA_DIR / f"{symbol.replace('.', '_')}.csv"
    df.to_csv(file_path, index=False)


def run_price_ingestion():
    universe_df = load_stock_universe()

    success = []
    failed = []

    for _, row in universe_df.iterrows():
        symbol = row["symbol"]
        try:
            print(f"Fetching data for {symbol}")
            df = fetch_price_data(symbol)
            save_price_data(df, symbol)
            success.append(symbol)
        except Exception as e:
            print(f"FAILED: {symbol} | {e}")
            failed.append(symbol)

    print("\nINGESTION SUMMARY")
    print("Successful:", success)
    print("Failed:", failed)


if __name__ == "__main__":
    run_price_ingestion()
