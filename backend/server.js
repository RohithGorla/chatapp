const express = require("express");
const cors = require("cors");

const {
  getSessionsList,
  getSessionById,
  createNewSession,
  getChatResponse,
  deleteSession,
} = require("./mockData");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.get("/api/sessions", (req, res) => {
  const sessions = getSessionsList();
  res.json({ sessions });
});

app.get("/api/new-chat", (req, res) => {
  const newSession = createNewSession();
  res.status(201).json({
    sessionId: newSession.id,
    session: {
      id: newSession.id,
      title: newSession.title,
    },
  });
});

app.get("/api/session/:id", (req, res) => {
  const { id } = req.params;
  const session = getSessionById(id);

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  res.json({
    id: session.id,
    title: session.title,
    messages: session.messages,
    structured: session.structured,
  });
});

app.post("/api/chat/:id", (req, res) => {
  const { id } = req.params;
  const { question } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Question must be a string" });
  }

  const result = getChatResponse(id, question);

  if (!result) {
    return res.status(404).json({ error: "Session not found" });
  }

  res.status(201).json({
    answerText: result.answerText,
    structured: result.structured,
    messages: result.messages,
  });
});

app.delete("/api/session/:id", (req, res) => {
  const { id } = req.params;
  const ok = deleteSession(id);

  if (!ok) {
    return res.status(404).json({ error: "Session not found" });
  }

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Mock API running on port ${PORT}`);
});
