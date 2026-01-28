import {
  LayoutDashboard,
  Activity,
  LineChart,
  TrendingUp,
  BrainCircuit,
} from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, selectedStock }) {
  const tabs = [
    { id: "Overview", icon: LayoutDashboard },
    { id: "Fundamentals", icon: Activity },
    { id: "Technicals", icon: LineChart },
    { id: "Prediction", icon: TrendingUp },
    { id: "Quantum", icon: BrainCircuit },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Glass container */}
      <div className="backdrop-blur-xl bg-white/75 border-b border-slate-200 shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">

            {/* LEFT — Brand */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow">
                FN
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-slate-900">
                  FinNet
                </span>
                <span className="text-[10px] tracking-widest font-semibold text-slate-400">
                  INSTITUTIONAL
                </span>
              </div>
            </div>

            {/* CENTER — Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-200/70 backdrop-blur rounded-xl p-1 border border-slate-300/40">
              {tabs.map(({ id, icon: Icon }) => {
                const isActive = activeTab === id;

                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        isActive
                          ? "bg-white text-blue-600 shadow ring-1 ring-slate-300"
                          : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                      }
                    `}
                  >
                    <Icon size={16} strokeWidth={2} />
                    {id}
                  </button>
                );
              })}
            </nav>

            {/* RIGHT — Market / Ticker */}
            <div className="flex items-center gap-4">
              {/* Market status */}
              <div className="hidden lg:flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <span className="text-xs font-semibold text-green-700">
                  NSE ACTIVE
                </span>
              </div>

              {/* Selected stock */}
              <div className="flex flex-col items-end border-l border-slate-300 pl-4">
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
                  ACTIVE TICKER
                </span>
                <span className="font-mono text-sm font-bold text-slate-900">
                  {selectedStock || "SELECT"}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
