import sys
from pathlib import Path
from datetime import datetime

# --- Add project root to Python path ---
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

import pandas as pd

from utils.path_config import PRICE_DATA_DIR, METADATA_DIR


MIN_REQUIRED_YEARS = 7  # hard exclusion threshold


def calculate_years_of_data(df: pd.DataFrame) -> float:
    """
    Calculate usable years of price history.
    """
    df = df.dropna(subset=["Date"])
    start_date = pd.to_datetime(df["Date"].min())
    end_date = pd.to_datetime(df["Date"].max())
    days = (end_date - start_date).days
    return round(days / 365.25, 2)


def assign_confidence_tier(years: float) -> str:
    """
    Assign data confidence tier based on years of data.
    """
    if years >= 15:
        return "HIGH"
    elif years >= 10:
        return "MEDIUM"
    elif years >= 7:
        return "LOW"
    else:
        return "EXCLUDE"


def run_data_validation():
    records = []

    price_files = list(PRICE_DATA_DIR.glob("*.csv"))

    if not price_files:
        raise RuntimeError("No price files found. Run fetch_prices.py first.")

    for file_path in price_files:
        symbol = file_path.stem.replace("_", ".")

        try:
            df = pd.read_csv(file_path)
            years = calculate_years_of_data(df)
            tier = assign_confidence_tier(years)

            records.append({
                "symbol": symbol,
                "years_of_data": years,
                "confidence_tier": tier,
                "last_updated": datetime.today().strftime("%Y-%m-%d")
            })

        except Exception as e:
            records.append({
                "symbol": symbol,
                "years_of_data": 0.0,
                "confidence_tier": "EXCLUDE",
                "last_updated": datetime.today().strftime("%Y-%m-%d")
            })
            print(f"Validation failed for {symbol}: {e}")

    quality_df = pd.DataFrame(records).sort_values(
        by="years_of_data", ascending=False
    )

    output_path = METADATA_DIR / "data_quality_scores.csv"
    quality_df.to_csv(output_path, index=False)

    print("\nDATA VALIDATION SUMMARY")
    print(quality_df)
    print(f"\nSaved to: {output_path}")


if __name__ == "__main__":
    run_data_validation()
