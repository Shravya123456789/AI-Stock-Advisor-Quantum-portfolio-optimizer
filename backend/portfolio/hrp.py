import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

import numpy as np
import pandas as pd
from scipy.cluster.hierarchy import linkage, dendrogram
from scipy.spatial.distance import squareform

from utils.path_config import PRICE_DATA_DIR, METADATA_DIR


def load_returns_matrix() -> pd.DataFrame:
    returns = []

    for file_path in PRICE_DATA_DIR.glob("*.csv"):
        symbol = file_path.stem.replace("_", ".")
        df = pd.read_csv(file_path)

        df["Date"] = pd.to_datetime(df["Date"])
        df = df.sort_values("Date")
        df["Return"] = df["Close"].pct_change()

        returns.append(
            df[["Date", "Return"]].rename(columns={"Return": symbol})
        )

    returns_df = returns[0]
    for r in returns[1:]:
        returns_df = returns_df.merge(r, on="Date", how="inner")

    returns_df.set_index("Date", inplace=True)
    return returns_df.dropna()


def correl_dist(corr: pd.DataFrame) -> pd.DataFrame:
    """
    Distance matrix for clustering.
    """
    return np.sqrt(0.5 * (1 - corr))


def get_quasi_diag(link: np.ndarray) -> list:
    """
    Sort clustered items.
    """
    link = link.astype(int)
    sort_ix = pd.Series([link[-1, 0], link[-1, 1]])
    num_items = link[-1, 3]

    while sort_ix.max() >= num_items:
        sort_ix.index = range(0, sort_ix.shape[0] * 2, 2)
        df = sort_ix[sort_ix >= num_items]
        i = df.index
        j = df.values - num_items
        sort_ix[i] = link[j, 0]
        df = pd.Series(link[j, 1], index=i + 1)
        sort_ix = pd.concat([sort_ix, df])
        sort_ix = sort_ix.sort_index()
        sort_ix.index = range(sort_ix.shape[0])

    return sort_ix.tolist()


def get_cluster_var(cov: pd.DataFrame, cluster_items: list) -> float:
    cov_slice = cov.loc[cluster_items, cluster_items]
    weights = np.repeat(1 / len(cluster_items), len(cluster_items))
    return float(weights @ cov_slice.values @ weights.T)


def hrp_allocation(returns: pd.DataFrame) -> pd.Series:
    """
    Compute HRP weights.
    """
    cov = returns.cov()
    corr = returns.corr()
    dist = correl_dist(corr)

    link = linkage(squareform(dist), method="single")
    sort_ix = get_quasi_diag(link)
    ordered_cols = returns.columns[sort_ix]

    weights = pd.Series(1.0, index=ordered_cols)

    clusters = [ordered_cols.tolist()]

    while clusters:
        cluster = clusters.pop(0)
        if len(cluster) <= 1:
            continue

        split = len(cluster) // 2
        c1 = cluster[:split]
        c2 = cluster[split:]

        var1 = get_cluster_var(cov, c1)
        var2 = get_cluster_var(cov, c2)

        alpha = 1 - var1 / (var1 + var2)
        weights[c1] *= alpha
        weights[c2] *= 1 - alpha

        clusters.append(c1)
        clusters.append(c2)

    return weights / weights.sum()


def run_hrp():
    returns = load_returns_matrix()

    weights = hrp_allocation(returns)
    portfolio = weights.reset_index()
    portfolio.columns = ["symbol", "weight"]

    out_path = PROJECT_ROOT / "data" / "processed" / "portfolio_hrp.csv"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    portfolio.to_csv(out_path, index=False)

    print("\nHRP PORTFOLIO")
    print(portfolio.sort_values("weight", ascending=False))
    print(f"\nSaved to: {out_path}")


if __name__ == "__main__":
    run_hrp()
