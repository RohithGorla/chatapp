import { useEffect, useState } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import ChatInput from "./components/ChatInput.jsx";
import TableResponse from "./components/TableResponse.jsx";
import AnswerFeedback from "./components/AnswerFeedback.jsx";
import { API_BASE_URL } from "./config.js";

function LandingPage() {
  const navigate = useNavigate();

  async function handleStartNew() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/new-chat`);
      if (!res.ok) throw new Error("Failed to create new session");
      const data = await res.json();
      navigate(`/chat/${data.sessionId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to start new chat");
    }
  }

  return (
    <div className="h-full flex items-center justify-center py-12">
      <div className="w-full max-w-lg mx-4 md:mx-0 px-6 py-10 rounded-2xl border border-slate-200 bg-white/95 shadow-xl dark:border-slate-800 dark:bg-slate-900/90 transform transition-all hover:-translate-y-1">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-slate-800 dark:text-slate-100">
          Start a new chat
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          Create a new session and start asking questions. Your conversations
          will appear in the left sidebar and are saved to this session.
        </p>
        <button
          onClick={handleStartNew}
          className="w-full text-sm md:text-base py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold shadow-md transition-transform active:scale-[0.99]"
        >
          New Chat
        </button>
      </div>
    </div>
  );
}

function ChatPageWrapper() {
  const { sessionId } = useParams();

  const [messages, setMessages] = useState([]);
  const [structured, setStructured] = useState(null);
  const [input, setInput] = useState("");
  const [loadingSession, setLoadingSession] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSession() {
      try {
        setLoadingSession(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/api/session/${sessionId}`);
        if (!res.ok) throw new Error("Failed to load session");
        const data = await res.json();
        setMessages(data.messages || []);
        setStructured(data.structured || null);
      } catch (err) {
        console.error(err);
        setError("Could not load this session.");
      } finally {
        setLoadingSession(false);
      }
    }

    if (sessionId) fetchSession();
  }, [sessionId]);

  async function handleSend() {
    if (!input.trim()) return;

    try {
      setSending(true);
      setIsTyping(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/api/chat/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input.trim() }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      setMessages(data.messages || []);
      setStructured(data.structured || null);
      setInput("");
    } catch (err) {
      console.error(err);
      setError("Failed to send message.");
    } finally {
      setSending(false);
      setTimeout(() => setIsTyping(false), 400);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">
            Session: {sessionId}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            All questions and answers below are tied to this session.
          </p>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Status:{" "}
          <span className={`font-medium ${loadingSession ? "text-amber-500" : "text-emerald-500"}`}>
            {loadingSession ? "Loading..." : "Connected"}
          </span>
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-3 md:px-6 py-6">
        {error && (
          <p className="text-xs text-red-600 mb-4 bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-800 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {loadingSession ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading conversation...</p>
        ) : (
          <div className="w-full max-w-3xl mx-auto space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.from === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    "max-w-[92%] md:max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-snug shadow-sm transition-all " +
                    (m.from === "user"
                      ? "bg-sky-500 text-white shadow-md"
                      : "bg-white border border-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700")
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl px-4 py-3 text-xs bg-white/75 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 dark:text-slate-400">Assistant is typing</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-75" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-150" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            <TableResponse
              title={structured?.title}
              columns={structured?.columns}
              rows={structured?.rows}
            />

            <AnswerFeedback />
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="w-full max-w-3xl mx-auto px-3 md:px-0 py-4">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSend}
            disabled={!input.trim() || sending || loadingSession}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-h-0">
        <header className="h-14 flex items-center justify-between px-3 md:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-shadow shadow-sm"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <div>
              <h1 className="text-base md:text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100">
                Lumibyte Chat
              </h1>
              <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400">
                Simplified chat with sessions &amp; structured responses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 min-h-0">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat/:sessionId" element={<ChatPageWrapper />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
