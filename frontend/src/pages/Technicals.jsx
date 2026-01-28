import React, { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, Area, ComposedChart, CartesianGrid
} from "recharts";
import { 
  ArrowUpRight, ArrowDownRight, Activity, TrendingUp, 
  BarChart3, Crosshair, AlertTriangle, CheckCircle2, Info
} from 'lucide-react';
import { priceData } from '../data/samplePriceData';
import { calculateRSI, calculateMACD, calculateSMA } from '../utils/technicalIndicators';

export default function Technicals() {
  
  // --- 1. COMPUTATION ENGINE ---
  const { chartData, fibLevels, analysis } = useMemo(() => {
    // A. Calculate Indicators
    const rsi = calculateRSI(priceData);
    const { macdLine, signalLine, histogram } = calculateMACD(priceData);
    const sma50 = calculateSMA(priceData, 50);
    const sma200 = calculateSMA(priceData, 200);

    // B. Merge Data
    const merged = priceData.map((d, i) => ({
      ...d,
      rsi: rsi[i],
      macd: macdLine[i],
      signal: signalLine[i],
      histogram: histogram[i],
      sma50: sma50[i],
      sma200: sma200[i],
    }));

    // C. Perform "AI" Analysis on the latest data point
    const current = merged[merged.length - 1];
    const prev = merged[merged.length - 2];

    // Volume Average (last 20 days)
    const recentVols = merged.slice(-20).map(d => d.volume);
    const avgVol = recentVols.reduce((a, b) => a + b, 0) / 20;
    const volRatio = (current.volume / avgVol).toFixed(2);

    const insights = [];

    // RSI Logic
    if (current.rsi > 70) insights.push({ type: 'danger', text: `RSI is Overbought (${current.rsi.toFixed(1)}). Price is extended and may pull back.` });
    else if (current.rsi < 30) insights.push({ type: 'success', text: `RSI is Oversold (${current.rsi.toFixed(1)}). Look for potential reversal entry.` });
    else if (current.rsi > 50 && prev.rsi <= 50) insights.push({ type: 'success', text: "RSI just crossed above 50, indicating shifting bullish momentum." });

    // MACD Logic
    if (current.macd > current.signal && prev.macd <= prev.signal) insights.push({ type: 'success', text: "Bullish MACD Crossover confirmed. Momentum is turning positive." });
    else if (current.macd < current.signal && prev.macd >= prev.signal) insights.push({ type: 'danger', text: "Bearish MACD Crossover confirmed. Momentum is turning negative." });

    // Moving Average Logic
    if (current.close > current.sma50) insights.push({ type: 'neutral', text: "Price is trading above the 50-Day Moving Average (Short-term Bullish)." });
    else insights.push({ type: 'neutral', text: "Price is trading below the 50-Day Moving Average (Short-term Bearish)." });

    // Volume Logic
    if (volRatio > 1.5) insights.push({ type: 'success', text: `High Volume Detected (${volRatio}x avg). This confirms the current price move validity.` });
    else if (volRatio < 0.5) insights.push({ type: 'danger', text: `Low Volume (${volRatio}x avg). Caution: Price move lacks conviction.` });

    return { 
      chartData: merged, 
      fibLevels: {
        max: Math.max(...priceData.map(d => d.close)),
        min: Math.min(...priceData.map(d => d.close)),
      },
      analysis: {
        insights,
        volRatio,
        trend: current.close > current.sma200 ? "Bullish" : "Bearish",
        lastPrice: current.close
      }
    };
  }, []);

  // --- CUSTOM TOOLTIP ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs font-mono z-50">
          <p className="mb-2 font-bold text-slate-400 border-b border-slate-700 pb-1">{label}</p>
          {payload.map((entry, idx) => (
            <div key={idx} className="flex justify-between gap-4 py-0.5">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-bold">{entry.value?.toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-slate-900">Technical Command Center</h1>
            <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold uppercase rounded tracking-wider">
              Pro Mode
            </span>
          </div>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Crosshair size={14} /> Synchronized Time-Series Analysis
          </p>
        </div>
        
        <div className={`px-5 py-2 rounded-lg border flex items-center gap-2 font-bold shadow-sm
          ${analysis.trend === "Bullish" ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
          {analysis.trend === "Bullish" ? <TrendingUp size={20} /> : <Activity size={20} />}
          <span>PRIMARY TREND: {analysis.trend.toUpperCase()}</span>
        </div>
      </div>

      {/* MASTER CHART */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={18}/>
            Price Action & Fibonacci
          </h2>
        </div>
        
        <div className="h-[400px] w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} syncId="techSync" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{fontSize: 10}} minTickGap={50} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} orientation="right" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              
              <Area type="monotone" dataKey="close" stroke="#2563eb" fill="url(#colorPrice)" strokeWidth={2} name="Price" />
              <Line type="monotone" dataKey="sma50" stroke="#f97316" dot={false} strokeWidth={1.5} name="SMA 50" />
              <Line type="monotone" dataKey="sma200" stroke="#7c3aed" dot={false} strokeWidth={1.5} name="SMA 200" />
              
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* INDICATOR CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-48">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
           <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">MACD Momentum</h3>
           <div className="flex-1 min-h-0">
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={chartData} syncId="techSync">
                  <XAxis dataKey="date" hide />
                  <YAxis orientation="right" tick={{fontSize: 10}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="histogram" fill="#cbd5e1" opacity={0.6} name="Hist" />
                  <Line type="monotone" dataKey="macd" stroke="#2563eb" dot={false} strokeWidth={1.5} name="MACD" />
                  <Line type="monotone" dataKey="signal" stroke="#f97316" dot={false} strokeWidth={1.5} name="Signal" />
               </ComposedChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
           <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">RSI Strength</h3>
           <div className="flex-1 min-h-0">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData} syncId="techSync">
                  <XAxis dataKey="date" hide />
                  <YAxis domain={[0, 100]} orientation="right" tick={{fontSize: 10}} ticks={[30, 70]} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
                  <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="rsi" stroke="#7c3aed" dot={false} strokeWidth={1.5} name="RSI" />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* --- NEW: ANALYTICAL INSIGHTS ENGINE --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Automated Signal Log */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Info size={18} className="text-blue-600"/>
            Technical Signal Log
          </h3>
          <div className="space-y-3">
            {analysis.insights.length > 0 ? (
              analysis.insights.map((insight, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border text-sm
                  ${insight.type === 'danger' ? 'bg-red-50 border-red-100 text-red-800' : 
                    insight.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 
                    'bg-slate-50 border-slate-100 text-slate-700'}`}>
                  {insight.type === 'danger' ? <AlertTriangle size={16} className="mt-0.5 shrink-0"/> : 
                   insight.type === 'success' ? <CheckCircle2 size={16} className="mt-0.5 shrink-0"/> :
                   <Info size={16} className="mt-0.5 shrink-0"/>}
                  <span className="leading-tight">{insight.text}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic">No major technical signals detected at this moment. Market is ranging.</p>
            )}
          </div>
        </div>

        {/* 2. Volume & Volatility Card */}
        <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-20"></div>
          
          <div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Volume Status</h3>
            <div className="text-2xl font-bold flex items-baseline gap-2">
              {analysis.volRatio}x <span className="text-sm font-normal text-slate-400">vs Avg</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${analysis.volRatio > 1 ? 'bg-blue-400' : 'bg-slate-500'}`} style={{ width: `${Math.min(analysis.volRatio * 50, 100)}%` }}></div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {analysis.volRatio > 1.2 ? "High institutional participation detected." : "Low liquidity. Exercise caution."}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Closing Price</h3>
            <p className="text-xl font-bold">₹{analysis.lastPrice.toFixed(2)}</p>
          </div>
        </div>

      </div>

    </div>
  );
}