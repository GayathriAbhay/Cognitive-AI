export default function AccessibilityPanel({ setFontSize, toggleDark }) {
  return (
    <div className="flex gap-2 mb-3">
      <button onClick={() => setFontSize("text-sm")} className="px-2 bg-gray-200 rounded">A-</button>
      <button onClick={() => setFontSize("text-base")} className="px-2 bg-gray-200 rounded">A</button>
      <button onClick={() => setFontSize("text-lg")} className="px-2 bg-gray-200 rounded">A+</button>

      <button onClick={toggleDark} className="px-3 bg-black text-white rounded">
        Contrast
      </button>
    </div>
  );
}