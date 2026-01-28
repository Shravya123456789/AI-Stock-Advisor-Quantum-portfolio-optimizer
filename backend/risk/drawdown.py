import pandas as pd
import numpy as np

def compute_max_drawdown(close_prices: pd.Series) -> float:
    """
    Maximum drawdown from price series.
    """
    prices = close_prices.dropna()
    if len(prices) < 50:
        return float("nan")

    cum_max = prices.cummax()
    drawdown = (prices - cum_max) / cum_max
    return float(drawdown.min())
