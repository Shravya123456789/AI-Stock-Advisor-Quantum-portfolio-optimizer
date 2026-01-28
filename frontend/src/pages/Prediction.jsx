import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  ShieldAlert, 
  CheckCircle2, 
  BrainCircuit, 
  CalendarClock 
} from "lucide-react";

/* ---------- COMPONENT: SCENARIO CARD ---------- */
function ScenarioCard({ title, type, probability, prices, cagr, assumptions, icon: Icon }) {
  // Dynamic Styling based on scenario type
  const styles = {
    bull: "border-emerald-200 bg-emerald-50/30",
    base: "border-blue-200 bg-blue-50/30",
    bear: "border-rose-200 bg-rose-50/30",
    
    headerText: {
      bull: "text-emerald-700",
      base: "text-blue-700",
      bear: "text-rose-700"
    },
    badge: {
      bull: "bg-emerald-100 text-emerald-800",
      base: "bg-blue-100 text-blue-800",
      bear: "bg-rose-100 text-rose-800"
    },
    bar: {
      bull: "bg-emerald-500",
      base: "bg-blue-500",
      bear: "bg-rose-500"
    }
  };

  const currentStyle = styles[type];

  return (
    <div className={`rounded-xl border shadow-sm p-6 relative overflow-hidden transition-all hover:shadow-md ${currentStyle}`}>
      
      {/* Probability Badge */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${styles.badge[type]}`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${styles.headerText[type]}`}>
              {title}
            </h3>
            <span className="text-xs text-slate-500 font-medium">Implied Probability</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-slate-800">{probability}%</span>
        </div>
      </div>

      {/* Probability Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full mb-6 overflow-hidden">
        <div className={`h-full rounded-full ${styles.bar[type]}`} style={{ width: `${probability}%` }}></div>
      </div>

      {/* Price Targets Table */}
      <div className="bg-white/60 rounded-lg border border-slate-200/60 p-4 mb-6 backdrop-blur-sm">
        <div className="grid grid-cols-3 gap-4 text-center border-b border-slate-200 pb-3 mb-3">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">12 Months</p>
            <p className="font-bold text-slate-900 mt-0.5">₹{prices[0]}</p>
          </div>
          <div className="border-x border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase">3 Years</p>
            <p className="font-bold text-slate-900 mt-0.5">₹{prices[1]}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">5 Years</p>
            <p className="font-bold text-slate-900 mt-0.5">₹{prices[2]}</p>
          </div>
        </div>
        <div className="flex justify-between items-center px-2">
          <span className="text-xs font-semibold text-slate-500">Est. 5Y CAGR</span>
          <span className={`text-sm font-bold ${styles.headerText[type]}`}>{cagr}</span>
        </div>
      </div>

      {/* Key Drivers */}
      <div>
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Key Drivers
        </h4>
        <ul className="space-y-2.5">
          {assumptions.map((a, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
              <CheckCircle2 size={14} className={`mt-0.5 shrink-0 opacity-60 ${styles.headerText[type]}`} />
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- MAIN PAGE ---------- */
export default function Prediction() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">

      {/* --- HEADER & METADATA --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Forecast Models</h1>
          <p className="mt-2 text-slate-600 max-w-2xl text-sm leading-relaxed">
            Multi-scenario valuation analysis based on DCF (Discounted Cash Flow) and technical momentum models. 
            Projections assume current regulatory environment remains stable.
          </p>
        </div>

        {/* AI Confidence Widget */}
        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm flex flex-col items-end">
             <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
               <BrainCircuit size={14} className="text-blue-600"/> Model Confidence
             </div>
             <div className="text-lg font-bold text-slate-800">High (87%)</div>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm flex flex-col items-end">
             <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
               <CalendarClock size={14} className="text-slate-400"/> Horizon
             </div>
             <div className="text-lg font-bold text-slate-800">FY2026-30</div>
          </div>
        </div>
      </div>

      {/* --- SCENARIO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* BULL CASE */}
        <ScenarioCard
          title="Bull Case"
          type="bull"
          icon={TrendingUp}
          probability={25}
          prices={["2,866", "3,924", "5,371"]}
          cagr="+18.5%"
          assumptions={[
            "Revenue growth accelerates >15% YoY",
            "Operating margins expand by 200bps",
            "Successful entry into new market segments",
            "Sector P/E re-rating to premium valuations"
          ]}
        />

        {/* BASE CASE */}
        <ScenarioCard
          title="Base Case"
          type="base"
          icon={Target}
          probability={60}
          prices={["2,768", "3,535", "4,514"]}
          cagr="+12.2%"
          assumptions={[
            "Growth aligns with 5-year historical avg",
            "Stable raw material costs & supply chain",
            "Dividend payout ratio maintained at 30%",
            "Neutral macro-economic environment"
          ]}
        />

        {/* BEAR CASE */}
        <ScenarioCard
          title="Bear Case"
          type="bear"
          icon={ShieldAlert}
          probability={15}
          prices={["2,646", "3,086", "3,599"]}
          cagr="+6.4%"
          assumptions={[
            "Inflationary pressure compresses margins",
            "Competitive intensity reduces pricing power",
            "Delay in key capex project execution",
            "Global recessionary headwinds"
          ]}
        />
      </div>

      {/* --- STRATEGIC VERDICT --- */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left: Verdict Badge */}
          <div className="lg:col-span-1 border-r border-slate-700 pr-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Final Verdict</p>
            <div className="inline-block px-5 py-2 bg-emerald-500 text-white font-bold text-lg rounded-lg shadow-lg shadow-emerald-500/20 mb-4">
              LONG-TERM BUY
            </div>
            <p className="text-sm text-slate-300">
              Risk/Reward ratio favors accumulation at current levels.
            </p>
          </div>

          {/* Center: Executive Summary */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-3">Executive Summary</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              The stock is currently trading at a <span className="text-white font-semibold">12% discount</span> to our Base Case intrinsic value. 
              While near-term volatility is expected due to sector rotation, the long-term structural drivers (digitization & margin expansion) remain intact.
            </p>
            <div className="flex gap-6">
              <div>
                 <span className="block text-xs text-slate-500 uppercase">Upside Potential</span>
                 <span className="text-emerald-400 font-bold text-lg">+18.4%</span>
              </div>
              <div>
                 <span className="block text-xs text-slate-500 uppercase">Downside Risk</span>
                 <span className="text-rose-400 font-bold text-lg">-6.2%</span>
              </div>
            </div>
          </div>

          {/* Right: Action Button */}
          <div className="lg:col-span-1 flex flex-col justify-center items-start lg:items-end border-l border-slate-700 pl-6">
             <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors w-full lg:w-auto shadow-sm">
                Download Report
             </button>
             <p className="text-[10px] text-slate-500 mt-3 text-center lg:text-right">
               Full PDF Analysis • Generated 2m ago
             </p>
          </div>

        </div>
      </div>

    </div>
  );
}