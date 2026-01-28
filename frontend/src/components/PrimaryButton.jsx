export default function PrimaryButton({ children }) {
  return (
    <button className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
      {children}
    </button>
  );
}
