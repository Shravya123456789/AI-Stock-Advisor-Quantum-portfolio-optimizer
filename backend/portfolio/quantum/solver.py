import numpy as np
import pandas as pd

from portfolio.quantum.qubo import build_qubo


def solve_qubo_simulated(Q: np.ndarray, symbols: list, max_assets: int):
    scores = np.diag(Q)
    selected_idx = np.argsort(scores)[:max_assets]
    return [symbols[i] for i in selected_idx]


def run_quantum_selection(
    risk_df: pd.DataFrame,
    max_assets: int = 5
):
    Q, symbols = build_qubo(
        risk_df=risk_df,
        max_assets=max_assets
    )

    selected_symbols = solve_qubo_simulated(Q, symbols, max_assets)
    return pd.DataFrame({"symbol": selected_symbols})
