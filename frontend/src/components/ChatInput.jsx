function ChatInput({ value, onChange, onSubmit, disabled }) {
  function handleSubmit(e) {
    e.preventDefault();
    if (disabled) return;
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 md:px-0 py-4 flex items-center gap-3 bg-white/70 dark:bg-slate-800/40 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 sticky bottom-0"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 text-sm rounded-2xl px-4 py-3 bg-slate-100 dark:bg-slate-900/70 
                   border border-slate-300 dark:border-slate-700
                   focus:border-sky-500 dark:focus:border-sky-400
                   focus:ring-2 focus:ring-sky-400/40
                   outline-none transition-all shadow-sm"
      />
      <button
        type="submit"
        disabled={disabled}
        className="text-sm px-4 py-3 rounded-2xl font-medium
                   bg-gradient-to-r from-sky-500 to-sky-600 
                   hover:from-sky-600 hover:to-sky-700
                   text-white shadow-md 
                   disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-all active:scale-95"
      >
        Send
      </button>
    </form>
  );
}

export default ChatInput;
