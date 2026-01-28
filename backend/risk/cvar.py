import numpy as np
import pandas as pd

def compute_cvar(returns: pd.Series, alpha: float = 0.05) -> float:
    """
    Compute Conditional Value at Risk (Expected Shortfall).
    """
    returns = returns.dropna()
    if len(returns) < 50:
        return float("nan")

    var = np.quantile(returns, alpha)
    cvar = returns[returns <= var].mean()
    return float(cvar)
