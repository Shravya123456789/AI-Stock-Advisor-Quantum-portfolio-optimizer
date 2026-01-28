import { useState } from "react";
import KPICard from "../components/KPICard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function Overview() {
  const [symbol, setSymbol] = useState("");
  const [stockData, setStockData] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [timeframe, setTimeframe] = useState("1y");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- FETCH FUNDAMENTALS ---------- */
  const fetchStockOverview = async () => {
    if (!symbol) return;

    setLoading(true);
    setError("");
    setStockData(null);
    setPriceData([]);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/stock/overview/${symbol}`
      );
      if (!res.ok) throw new Error();

      const data = await res.json();
      setStockData(data);

      fetchPriceData(symbol, timeframe);
    } catch {
      setError("Stock not found or backend error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- FETCH PRICE DATA ---------- */
  const fetchPriceData = async (sym, tf) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/stock/prices/${sym}?period=${tf}`
      );
      if (!res.ok) throw new Error();

      const data = await res.json();
      setPriceData(data.prices);
    } catch {
      setPriceData([]);
    }
  };

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Stock Search & Overview
        </h1>
        <p className="mt-2 text-slate-600 max-w-3xl">
          Search NSE stocks and explore real fundamentals and price trends.
        </p>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Search NSE Stock
        </label>

        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && fetchStockOverview()}
          placeholder="RELIANCE, TCS, INFY"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />

        {loading && <p className="mt-3 text-sm text-slate-500">Loading…</p>}
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <KPICard title="Market Cap" value={stockData ? `₹ ${stockData.market_cap}` : "₹ —"} />
        <KPICard title="P/E Ratio" value={stockData?.pe_ratio ?? "—"} />
        <KPICard title="ROE" value={stockData?.roe ?? "—"} />
        <KPICard title="Debt / Equity" value={stockData?.debt_to_equity ?? "—"} />
      </div>

      {/* PRICE CHART */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">Price Chart</h2>

          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            {["1M", "1y", "3y", "5y"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTimeframe(t);
                  fetchPriceData(symbol, t);
                }}
                className={`px-3 py-1 text-xs rounded-md
                  ${timeframe === t
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600"}`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {priceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={false} axisLine={false} />
              <YAxis domain={["auto", "auto"]} axisLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">
            Search a stock to load price chart
          </div>
        )}
      </div>

      {/* EXPLANATION */}
      {stockData && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
          <h4 className="text-sm font-bold text-indigo-900 mb-2">
            How to read this data
          </h4>
          <p className="text-sm text-indigo-800">
            Price data is fetched from NSE historical records.
            Fundamentals are sourced from company filings and market data.
          </p>
        </div>
      )}

    </div>
  );
}
