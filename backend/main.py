from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

from portfolio.quantum.run_quantum import run_quantum_optimization

app = FastAPI(title="Quantum Portfolio Backend")


class PortfolioRequest(BaseModel):
    stocks: list[str]
    expected_returns: list[float]
    covariance_matrix: list[list[float]]


@app.post("/quantum/optimize")
def optimize_portfolio(data: PortfolioRequest):
    result = run_quantum_optimization(
        stocks=data.stocks,
        expected_returns=np.array(data.expected_returns),
        covariance_matrix=np.array(data.covariance_matrix)
    )

    return result
