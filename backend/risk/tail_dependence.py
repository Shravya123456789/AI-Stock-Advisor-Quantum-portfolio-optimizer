import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

import pandas as pd
import numpy as np

from utils.path_config import PRICE_DATA_DIR


TAIL_QUANTILE = 0.05  # worst 5% days


def load_returns_matrix() -> pd.DataFrame:
    """
    Load price data and build aligned daily returns matrix.
    """
    returns = []

    for file_path in PRICE_DATA_DIR.glob("*.csv"):
        symbol = file_path.stem.replace("_", ".")
        df = pd.read_csv(file_path)

        df["Date"] = pd.to_datetime(df["Date"])
        df = df.sort_values("Date")

        df["Return"] = df["Close"].pct_change()
        returns.append(
            df[["Date", "Return"]].rename(columns={"Return": symbol})
        )

    returns_df = returns[0]
    for r in returns[1:]:
        returns_df = returns_df.merge(r, on="Date", how="inner")

    returns_df.set_index("Date", inplace=True)
    return returns_df.dropna()


def compute_tail_correlation(returns_df: pd.DataFrame) -> pd.DataFrame:
    """
    Correlation during worst market days.
    """
    market_returns = returns_df.mean(axis=1)
    threshold = market_returns.quantile(TAIL_QUANTILE)

    crash_days = returns_df[market_returns <= threshold]
    return crash_days.corr()


def run_tail_dependence():
    returns_df = load_returns_matrix()

    corr_matrix = returns_df.corr()
    tail_corr_matrix = compute_tail_correlation(returns_df)

    out_dir = PROJECT_ROOT / "data" / "processed"
    out_dir.mkdir(parents=True, exist_ok=True)

    corr_matrix.to_csv(out_dir / "correlation_matrix.csv")
    tail_corr_matrix.to_csv(out_dir / "tail_correlation_matrix.csv")

    print("\nCORRELATION MATRIX")
    print(corr_matrix)

    print("\nTAIL (CRASH) CORRELATION MATRIX")
    print(tail_corr_matrix)


if __name__ == "__main__":
    run_tail_dependence()
