import pandas as pd
import numpy as np

def compute_amihud_illiquidity(df: pd.DataFrame) -> float:
    """
    Amihud Illiquidity: mean(|return| / volume)
    """
    required_cols = {"Close", "Volume"}
    if not required_cols.issubset(df.columns):
        return float("nan")

    df = df.copy()
    df["Return"] = df["Close"].pct_change()
    df = df.dropna(subset=["Return", "Volume"])
    df = df[df["Volume"] > 0]

    if len(df) < 50:
        return float("nan")

    illiq = np.mean(np.abs(df["Return"]) / df["Volume"])
    return float(illiq)
