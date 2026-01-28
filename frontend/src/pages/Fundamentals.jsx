export default function Fundamentals() {
  return (
    <div className="space-y-10">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Fundamental Analysis
        </h1>
        <p className="mt-2 text-slate-600 max-w-3xl">
          Comprehensive evaluation of company fundamentals based on
          profitability, growth, leverage, and valuation metrics.
        </p>
      </div>

      {/* OVERALL FUNDAMENTAL SCORE */}
      <div className="bg-white rounded-2xl border border-fin-border shadow-sm p-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">
            Overall Fundamental Score
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">
            78 / 100
          </h2>
          <p className="mt-2 text-sm text-green-600 font-medium">
            Strong Fundamentals
          </p>
        </div>

        {/* Score Indicator */}
        <div className="h-28 w-28 rounded-full border-8 border-green-500 flex items-center justify-center">
          <span className="text-2xl font-bold text-green-600">78</span>
        </div>
      </div>

      {/* SUB-SCORES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          ["Profitability", 82, "green"],
          ["Growth", 75, "blue"],
          ["Leverage", 68, "yellow"],
          ["Valuation", 88, "green"],
        ].map(([title, score, color]) => (
          <div
            key={title}
            className="bg-white rounded-xl border border-fin-border shadow-sm p-6"
          >
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <p className={`mt-2 text-3xl font-bold text-${color}-600`}>
              {score}
            </p>
            <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-${color}-500`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED EXPLANATION */}
      <div className="bg-white rounded-2xl border border-fin-border shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">
          Fundamental Breakdown
        </h2>

        <div className="space-y-4 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-900">
              Profitability:
            </span>{" "}
            Company maintains healthy margins and consistent return on equity.
          </p>

          <p>
            <span className="font-semibold text-slate-900">
              Growth:
            </span>{" "}
            Revenue and earnings growth remain stable with moderate acceleration.
          </p>

          <p>
            <span className="font-semibold text-slate-900">
              Leverage:
            </span>{" "}
            Debt levels are manageable but require monitoring.
          </p>

          <p>
            <span className="font-semibold text-slate-900">
              Valuation:
            </span>{" "}
            Stock is trading at attractive valuation compared to peers.
          </p>
        </div>
      </div>

    </div>
  );
}
