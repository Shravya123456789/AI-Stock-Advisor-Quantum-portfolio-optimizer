export default function KPICard({
  title,
  value,
  delta = null,
  trend = "neutral",
}) {
  const trendStyles = {
    up: "text-green-600 bg-green-50 border-green-200",
    down: "text-red-600 bg-red-50 border-red-200",
    neutral: "text-slate-600 bg-slate-50 border-slate-200",
  };

  const arrow = trend === "up" ? "▲" : trend === "down" ? "▼" : null;

  return (
    <div className="bg-white rounded-xl border border-fin-border shadow-sm p-6 hover:shadow-md transition-shadow">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {title}
      </p>

      <div className="mt-2 flex items-end justify-between">
        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>

        {delta && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${trendStyles[trend]}`}
          >
            {arrow} {delta}
          </span>
        )}
      </div>
    </div>
  );
}
