function TableResponse({ title, columns, rows }) {
  if (!columns || !rows || rows.length === 0) {
    return (
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
        No structured/tabular response for this question yet.
      </p>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm shadow-md overflow-hidden text-xs transition-all">
      
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Structured Response
          </p>
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Table View
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[360px] border-collapse w-full">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-left px-4 py-3 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold 
                             bg-slate-100/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 backdrop-blur-sm"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={`transition-colors ${
                  rIdx % 2 === 0
                    ? "bg-white/90 dark:bg-slate-950/30"
                    : "bg-slate-50/80 dark:bg-slate-900/50"
                } hover:bg-sky-50/70 dark:hover:bg-sky-900/20`}
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 align-top 
                               text-slate-700 dark:text-slate-200 leading-relaxed"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableResponse;