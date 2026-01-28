import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

import pandas as pd
import numpy as np

from utils.path_config import METADATA_DIR, PRICE_DATA_DIR


# ---- HARD CONSTRAINT PARAMETERS (LOCKED) ----
MAX_WEIGHT_HIGH = 0.20
MAX_WEIGHT_MEDIUM = 0.10
MAX_WEIGHT_LOW = 0.05

CVaR_LIMIT = -0.07          # penalize extreme crash risk
ILLIQUIDITY_PERCENTILE = 0.90  # top 10% illiquid stocks penalized


def apply_constraints():
    # Load inputs
    hrp_path = PROJECT_ROOT / "data" / "processed" / "portfolio_hrp.csv"
    risk_path = PROJECT_ROOT / "data" / "processed" / "risk_metrics.csv"
    quality_path = METADATA_DIR / "data_quality_scores.csv"

    portfolio = pd.read_csv(hrp_path)
    risk = pd.read_csv(risk_path)
    quality = pd.read_csv(quality_path)

    df = portfolio.merge(risk, on="symbol", how="left") \
                   .merge(quality[["symbol", "confidence_tier"]], on="symbol", how="left")

    # ---- 1️⃣ DATA CONFIDENCE CAPS ----
    def cap_weight(row):
        if row["confidence_tier"] == "HIGH":
            return min(row["weight"], MAX_WEIGHT_HIGH)
        elif row["confidence_tier"] == "MEDIUM":
            return min(row["weight"], MAX_WEIGHT_MEDIUM)
        elif row["confidence_tier"] == "LOW":
            return min(row["weight"], MAX_WEIGHT_LOW)
        else:
            return 0.0

    df["weight"] = df.apply(cap_weight, axis=1)

    # ---- 2️⃣ CVaR PENALTY ----
    df.loc[df["cvar_5pct"] < CVaR_LIMIT, "weight"] *= 0.5

    # ---- 3️⃣ LIQUIDITY PENALTY ----
    illiq_threshold = df["amihud_illiquidity"].quantile(ILLIQUIDITY_PERCENTILE)
    df.loc[df["amihud_illiquidity"] >= illiq_threshold, "weight"] *= 0.5

    # ---- 4️⃣ RE-NORMALIZE ----
    total_weight = df["weight"].sum()
    if total_weight > 0:
        df["weight"] = df["weight"] / total_weight

    # Save output
    out_path = PROJECT_ROOT / "data" / "processed" / "portfolio_constrained.csv"
    df[["symbol", "weight"]].to_csv(out_path, index=False)

    print("\nCONSTRAINED PORTFOLIO")
    print(df[["symbol", "weight", "confidence_tier", "cvar_5pct"]]
          .sort_values("weight", ascending=False))
    print(f"\nSaved to: {out_path}")


if __name__ == "__main__":
    apply_constraints()
