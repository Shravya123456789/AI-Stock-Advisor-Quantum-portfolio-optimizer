import numpy as np
import pandas as pd

def compute_metrics(df: pd.DataFrame):
    """
    Computes expected return & volatility
    """
    df = df.copy()
    df["daily_return"] = df["Close"].pct_change()

    expected_return = df["daily_return"].mean() * 252
    volatility = df["daily_return"].std() * np.sqrt(252)

    # CVaR (5%)
    cvar_5 = df["daily_return"].quantile(0.05)

    return {
        "expected_return": float(expected_return),
        "volatility": float(volatility),
        "cvar_5pct": float(cvar_5)
    }
