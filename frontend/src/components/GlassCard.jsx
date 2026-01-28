export default function GlassCard({ title, children }) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm border p-6">
      {title && (
        <h3 className="text-sm font-semibold mb-4 text-slate-700">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
