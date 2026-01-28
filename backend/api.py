from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

from market.data_fetcher import fetch_stock_history
from market.indicators import compute_metrics
from portfolio.quantum.run_quantum import run_quantum_optimization



app = FastAPI(title="Quantum Portfolio API")

# ✅ KEEP CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from stock.overview import get_stock_overview
from fastapi import HTTPException

@app.get("/stock/overview/{symbol}")
def stock_overview(symbol: str):
    try:
        return get_stock_overview(symbol.upper())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class QuantumRequest(BaseModel):
    symbols: list[str]
    max_assets: int = 5


@app.post("/quantum/optimize")
def optimize_portfolio(req: QuantumRequest):
    rows = []

    for symbol in req.symbols:
        df = fetch_stock_history(symbol)
        metrics = compute_metrics(df)

        rows.append({
            "symbol": symbol,
            "cvar_5pct": metrics["cvar_5pct"],
            "amihud_illiquidity": metrics["volatility"],
            "confidence_tier": "HIGH"
        })

    risk_df = pd.DataFrame(rows)

    result = run_quantum_optimization(
        risk_df,
        max_assets=req.max_assets
    )

    weight = round(100 / len(result["selected_stocks"]), 2)
    from fastapi import HTTPException
    import yfinance as yf

@app.get("/stock/overview/{symbol}")
def stock_overview(symbol: str):
    try:
        ticker = yf.Ticker(f"{symbol}.NS")

        info = ticker.info
        history = ticker.history(period="1y")

        if history.empty:
            raise HTTPException(status_code=400, detail="Invalid NSE symbol")

        return {
            "symbol": symbol,
            "market_cap": info.get("marketCap"),
            "pe_ratio": info.get("trailingPE"),
            "roe": info.get("returnOnEquity"),
            "debt_to_equity": info.get("debtToEquity"),
            "revenue": info.get("totalRevenue"),
            "net_profit": info.get("netIncomeToCommon"),
            "eps": info.get("trailingEps"),
            "dividend_yield": info.get("dividendYield"),
            "price_history": history["Close"].reset_index().to_dict(orient="records")
        }

    except Exception:
        raise HTTPException(status_code=400, detail="Stock not found")

    import yfinance as yf
    from fastapi import HTTPException

@app.get("/stock/overview/{symbol}")
def stock_overview(symbol: str):
    try:
        ticker = yf.Ticker(f"{symbol}.NS")
        info = ticker.info

        if not info or "regularMarketPrice" not in info:
            raise HTTPException(status_code=400, detail="Invalid NSE symbol")

        return {
            "symbol": symbol,
            "price": info.get("regularMarketPrice"),
            "market_cap": info.get("marketCap"),
            "pe_ratio": info.get("trailingPE"),
            "roe": info.get("returnOnEquity"),
            "debt_to_equity": info.get("debtToEquity"),
            "sector": info.get("sector"),
            "industry": info.get("industry")
        }

    except Exception:
        raise HTTPException(status_code=400, detail="Stock not found")

import yfinance as yf
from fastapi import HTTPException

@app.get("/stock/prices/{symbol}")
def get_stock_prices(symbol: str, period: str = "1y"):
    try:
        ticker = yf.Ticker(f"{symbol}.NS")
        hist = ticker.history(period=period)

        if hist.empty:
            raise HTTPException(status_code=404, detail="No price data found")

        prices = [
            {
                "date": idx.strftime("%Y-%m-%d"),
                "open": round(row["Open"], 2),
                "high": round(row["High"], 2),
                "low": round(row["Low"], 2),
                "close": round(row["Close"], 2),
                "volume": int(row["Volume"])
            }
            for idx, row in hist.iterrows()
        ]

        return {
            "symbol": symbol,
            "period": period,
            "prices": prices
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "input_assets": req.symbols,
        "selected_stocks": result["selected_stocks"],
        "num_selected": result["num_selected"],
        "weights": {
            s: weight for s in result["selected_stocks"]
        }
    }
