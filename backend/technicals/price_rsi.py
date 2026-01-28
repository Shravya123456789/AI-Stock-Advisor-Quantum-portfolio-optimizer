import pandas as pd
import numpy as np


def calculate_rsi(close: pd.Series, period: int = 14) -> pd.Series:
    delta = close.diff()

    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)

    avg_gain = gain.rolling(period).mean()
    avg_loss = loss.rolling(period).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    return rsi


def prepare_price_indicators(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["MA_50"] = df["Close"].rolling(50).mean()
    df["MA_200"] = df["Close"].rolling(200).mean()
    df["RSI"] = calculate_rsi(df["Close"])

    return df
