import sys
from pathlib import Path
from datetime import datetime

# --- Add project root to Python path ---
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

import pandas as pd

from utils.path_config import PRICE_DATA_DIR
from cvar import compute_cvar
from liquidity import compute_amihud_illiquidity
from drawdown import compute_max_drawdown


def compute_daily_returns(df: pd.DataFrame) -> pd.Series:
    return df["Close"].pct_change()


def run_risk_engine():
    records = []

    price_files = list(PRICE_DATA_DIR.glob("*.csv"))
    if not price_files:
        raise RuntimeError("No price files found. Run ingestion first.")

    for file_path in price_files:
        symbol = file_path.stem.replace("_", ".")

        try:
            df = pd.read_csv(file_path)

            if "Date" in df.columns:
                df["Date"] = pd.to_datetime(df["Date"])
                df = df.sort_values("Date")

            returns = compute_daily_returns(df)

            cvar_5 = compute_cvar(returns, alpha=0.05)
            illiq = compute_amihud_illiquidity(df)
            max_dd = compute_max_drawdown(df["Close"])

            records.append({
                "symbol": symbol,
                "cvar_5pct": cvar_5,
                "amihud_illiquidity": illiq,
                "max_drawdown": max_dd,
                "last_updated": datetime.today().strftime("%Y-%m-%d")
            })

        except Exception as e:
            print(f"Risk calc failed for {symbol}: {e}")
            records.append({
                "symbol": symbol,
                "cvar_5pct": float("nan"),
                "amihud_illiquidity": float("nan"),
                "max_drawdown": float("nan"),
                "last_updated": datetime.today().strftime("%Y-%m-%d")
            })

    risk_df = pd.DataFrame(records)

    output_path = PROJECT_ROOT / "data" / "processed" / "risk_metrics.csv"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    risk_df.to_csv(output_path, index=False)

    print("\nRISK ENGINE SUMMARY")
    print(risk_df)
    print(f"\nSaved to: {output_path}")


if __name__ == "__main__":
    run_risk_engine()
