import { useEffect, useState } from "react";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  function handleToggle() {
    setIsDark((prev) => !prev);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="relative inline-flex items-center gap-2 text-[11px] md:text-xs 
                 px-3 py-1.5 rounded-full border border-slate-300 dark:border-neutral-700 
                 bg-white/70 dark:bg-black/70 backdrop-blur-sm shadow-md 
                 hover:shadow-lg transition-all active:scale-[0.97]"
    >
      <span className="w-4 h-4 flex items-center justify-center">
        {isDark ? "🌙" : "☀️"}
      </span>

      <span className="font-medium text-slate-700 dark:text-neutral-200">
        {isDark ? "Dark mode" : "Light mode"}
      </span>

      {/* Switch */}
      <span className="absolute top-1/2 -translate-y-1/2 right-1 w-10 h-5 
                       rounded-full bg-slate-300/70 dark:bg-neutral-800/80 
                       transition-all shadow-inner">
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full 
                      bg-white dark:bg-black shadow-sm transition-transform 
                      ${isDark ? "translate-x-0" : "translate-x-5"}`}
        />
      </span>
    </button>
  );
}

export default ThemeToggle;
