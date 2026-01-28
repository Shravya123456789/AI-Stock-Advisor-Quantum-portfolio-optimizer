import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Loader2,
  BarChart3,
  Atom
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from "recharts";

/* ---------- NIFTY 50 UNIVERSE ---------- */
const ALL_STOCKS = [
  "ADANIENT","ADANIPORTS","APOLLOHOSP","ASIANPAINT","AXISBANK",
  "BAJAJ-AUTO","BAJAJFINSV","BAJFINANCE","BHARTIARTL","BPCL",
  "BRITANNIA","CIPLA","COALINDIA","DIVISLAB","DRREDDY",
  "EICHERMOT","GRASIM","HCLTECH","HDFCBANK","HDFCLIFE",
  "HEROMOTOCO","HINDALCO","HINDUNILVR","ICICIBANK","INDUSINDBK",
  "INFY","ITC","JSWSTEEL","KOTAKBANK","LT",
  "M&M","MARUTI","NESTLEIND","NTPC","ONGC",
  "POWERGRID","RELIANCE","SBIN","SBILIFE","SUNPHARMA",
  "TATACONSUM","TATAMOTORS","TATASTEEL","TCS","TECHM",
  "TITAN","ULTRACEMCO","UPL","WIPRO"
];

const COLORS = [
  "#2563eb", "#7c3aed", "#db2777",
  "#ea580c", "#16a34a", "#0891b2"
];

export default function Quantum() {
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleStock = (stock) => {
    setError("");
    setResult(null);

    if (selectedStocks.includes(stock)) {
      setSelectedStocks(selectedStocks.filter(s => s !== stock));
    } else {
      if (selectedStocks.length >= 15) {
        setError("Maximum 15 stocks allowed.");
        return;
      }
      setSelectedStocks([...selectedStocks, stock]);
    }
  };

  const runQuantumOptimization = async () => {
    if (selectedStocks.length < 5) {
      setError("Select at least 5 stocks to run optimization.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
  symbols: selectedStocks,
  max_assets: Math.min(3, selectedStocks.length)
};


      const res = await fetch("http://127.0.0.1:8000/quantum/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();
      setResult(data);

    } catch {
      setError("Quantum optimization failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = result
    ? Object.entries(result.weights).map(([name, value]) => ({
        name,
        value
      }))
    : [];

  const portfolioRisk =
    result ? (result.num_selected * 4).toFixed(1) : null;

  return (
    <div className="space-y-8 pb-12">

      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Atom size={32} className="text-indigo-600 animate-spin-slow"/>
          Quantum Portfolio Optimization
        </h1>
        <p className="mt-2 text-slate-600 text-sm">
          Portfolio selection using <strong>QUBO</strong> and <strong>QAOA</strong> on a quantum simulator.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white p-6 rounded-xl border">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-sm">Select Portfolio Universe</h2>
              <span className="text-xs font-bold">
                {selectedStocks.length} Selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto">
              {ALL_STOCKS.map(stock => (
                <button
                  key={stock}
                  onClick={() => toggleStock(stock)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border
                    ${selectedStocks.includes(stock)
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-slate-600"}`}
                >
                  {stock}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-4 flex gap-2 text-rose-600 text-sm">
                <AlertTriangle size={16}/> {error}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Classical complexity: O(2ⁿ) • Quantum-inspired search reduces solution space
          </p>

          <div className="bg-slate-900 p-6 rounded-xl flex justify-between items-center text-white">
            <div>
              <h3 className="font-bold flex gap-2 items-center">
                <Cpu size={18}/> Quantum Engine
              </h3>
              <p className="text-xs text-slate-400">
                QAOA • Qiskit Simulator
              </p>
            </div>

            <button
              onClick={runQuantumOptimization}
              disabled={loading || selectedStocks.length < 5}
              className="px-8 py-3 bg-emerald-500 rounded-lg font-bold"
            >
              {loading ? "Running…" : "Run Optimization"}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {result ? (
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-bold mb-4 flex gap-2 items-center">
                <BarChart3 size={18}/> Optimal Portfolio
              </h3>

              <div className="h-64 relative">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" innerRadius={60} outerRadius={90}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 space-y-2">
                {Object.entries(result.weights).map(([stock, w]) => (
                  <div key={stock} className="flex justify-between text-sm">
                    <span>{stock}</span>
                    <span className="font-bold">{w}%</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-indigo-50 p-4 rounded-lg text-sm">
                <p><strong>Estimated Risk:</strong> {portfolioRisk}%</p>
                <p className="mt-2">
                  Selected assets minimize concentration risk while preserving diversification using quantum optimization.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed rounded-xl flex items-center justify-center text-slate-400">
              Select stocks and run optimization
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
