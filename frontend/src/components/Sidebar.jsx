import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config.js";

function Sidebar({ isOpen, setIsOpen }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSessions() {
      try {
        setLoadingSessions(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/api/sessions`);
        if (!res.ok) throw new Error("Failed to load sessions");
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (err) {
        console.error(err);
        setError("Could not load sessions");
      } finally {
        setLoadingSessions(false);
      }
    }

    fetchSessions();
  }, []);

  async function handleNewChat() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/new-chat`);
      if (!res.ok) throw new Error("Failed to create new session");
      const data = await res.json();
      const newId = data.sessionId;

      setSessions((prev) => [
        ...prev,
        { id: newId, title: data.session?.title || `Session ${newId}` },
      ]);

      navigate(`/chat/${newId}`);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to start new chat");
    }
  }

  async function handleDeleteSession(e, id) {
    e.preventDefault();
    e.stopPropagation();
    const confirmDelete = window.confirm("Delete this session?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/session/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        throw new Error("Failed to delete session");
      }
      setSessions((prev) => prev.filter((s) => s.id !== id));

      if (location.pathname === `/chat/${id}`) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete session");
    }
  }

  const widthClass = isCollapsed ? "md:w-20 w-full" : "md:w-72 w-full";

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside
        className={`z-30 ${widthClass} md:translate-x-0 md:static md:h-screen fixed inset-y-0 left-0 transform transition-transform duration-300 border-r border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/75 backdrop-blur-sm shadow-lg flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-gradient-to-b from-transparent to-white/60 dark:to-slate-900/60">
          {!isCollapsed && (
            <button
              onClick={handleNewChat}
              className="flex-1 text-xs md:text-sm py-2 px-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all shadow-sm active:scale-[0.995]"
            >
              + New Chat
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-xs px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? "»" : "«"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 text-xs md:text-sm">
          {!isCollapsed && (
            <p className="px-2 text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
              Sessions
            </p>
          )}

          {loadingSessions && (
            <p className="px-2 text-[11px] text-slate-500 dark:text-slate-400">
              Loading sessions...
            </p>
          )}

          {error && !loadingSessions && (
            <p className="px-2 text-[11px] text-red-500">{error}</p>
          )}

          {sessions.map((session) => {
            const isActive = location.pathname === `/chat/${session.id}`;

            return (
              <Link
                key={session.id}
                to={`/chat/${session.id}`}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-colors duration-150 ${
                  isActive
                    ? "bg-sky-500/10 border border-sky-500 text-sky-600 dark:text-sky-400 shadow-inner"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[11px] font-semibold text-slate-700 dark:text-slate-100 shrink-0">
                    {session.title?.charAt(0)?.toUpperCase() ||
                      session.id.charAt(0).toUpperCase()}
                  </div>
                  {!isCollapsed && (
                    <span className="truncate text-sm leading-tight">
                      {session.title || session.id}
                    </span>
                  )}
                </div>

                {!isCollapsed && (
                  <button
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className="text-[10px] px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:border-red-500 transition-colors"
                    title="Delete session"
                  >
                    ✕
                  </button>
                )}
              </Link>
            );
          })}

          {!loadingSessions && sessions.length === 0 && !error && (
            <p className="px-2 text-[11px] text-slate-500 dark:text-slate-400">
              No sessions yet. Start a new chat.
            </p>
          )}
        </div>

        <div className="px-3 py-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 bg-gradient-to-t from-transparent to-white/50 dark:to-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[11px] font-semibold text-slate-700 dark:text-slate-100">
              U
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <p className="font-medium leading-tight text-slate-700 dark:text-slate-100">
                  Demo User
                </p>
                <p className="text-[10px]">Free plan</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
