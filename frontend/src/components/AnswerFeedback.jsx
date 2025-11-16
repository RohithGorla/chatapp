import { useState } from "react";

function AnswerFeedback() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
      <span>Was this helpful?</span>

      <button
        type="button"
        onClick={() => setSelected("up")}
        className={`px-2 py-1 rounded-lg border transition-colors ${
          selected === "up"
            ? "bg-green-100 dark:bg-green-900 border-green-400"
            : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        👍
      </button>

      <button
        type="button"
        onClick={() => setSelected("down")}
        className={`px-2 py-1 rounded-lg border transition-colors ${
          selected === "down"
            ? "bg-red-100 dark:bg-red-900 border-red-400"
            : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        👎
      </button>
    </div>
  );
}

export default AnswerFeedback;
