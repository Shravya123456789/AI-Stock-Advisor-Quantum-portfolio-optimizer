import numpy as np
import pandas as pd


def build_qubo(
    risk_df: pd.DataFrame,
    max_assets: int,
    lambda_risk: float = 1.0,
    lambda_liquidity: float = 0.5,
    lambda_confidence: float = 0.5,
):
    symbols = risk_df["symbol"].tolist()
    n = len(symbols)

    Q = np.zeros((n, n))

    for i in range(n):
        cvar = abs(risk_df.loc[i, "cvar_5pct"])
        illiq = risk_df.loc[i, "amihud_illiquidity"]

        confidence_penalty = {
            "HIGH": 0.0,
            "MEDIUM": 0.2,
            "LOW": 0.5,
        }.get(risk_df.loc[i, "confidence_tier"], 1.0)

        Q[i, i] += (
            lambda_risk * cvar
            + lambda_liquidity * illiq
            + lambda_confidence * confidence_penalty
        )

    penalty = 10.0
    for i in range(n):
        Q[i, i] += penalty * (1 - 2 * max_assets)
        for j in range(i + 1, n):
            Q[i, j] += 2 * penalty

    return Q, symbols
