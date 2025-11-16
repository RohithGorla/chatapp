const sessions = []; // ← now empty, no default sessions

/**
 * Return a lightweight list of sessions (id + title).
 * @returns {{id: string, title: string}[]}
 */
function getSessionsList() {
  return sessions.map((s) => ({ id: s.id, title: s.title }));
}

/**
 * Find a session by id.
 * @param {string} id
 * @returns {Object|null}
 */
function getSessionById(id) {
  return sessions.find((s) => s.id === id) || null;
}

/**
 * Create a new session and append to the in-memory store.
 * @returns {Object} new session object
 */
function createNewSession() {
  const newId = `s${sessions.length + 1}`;
  const newSession = {
    id: newId,
    title: `New session ${sessions.length + 1}`,
    messages: [
      {
        id: 1,
        from: "assistant",
        text: "This is a brand new session. Ask your first question!",
      },
    ],
    structured: {
      title: "Empty Session",
      columns: ["Info", "Value"],
      rows: [["Status", "No questions asked yet"]],
    },
  };

  sessions.push(newSession);
  return newSession;
}

/**
 * Append a user question and a mock assistant answer to a session.
 */
function getChatResponse(sessionId, question) {
  const session = getSessionById(sessionId);
  if (!session) return null;

  const nextMessageId = session.messages.length + 1;

  session.messages.push({
    id: nextMessageId,
    from: "user",
    text: question,
  });

  const answerText =
    "This is a mock answer from the backend. In a real system, this would be generated dynamically.";

  session.messages.push({
    id: nextMessageId + 1,
    from: "assistant",
    text: answerText,
  });

  const structured = {
    title: "Mock Structured Answer",
    columns: ["Field", "Value"],
    rows: [
      ["Session ID", sessionId],
      ["Question length", `${question.length} characters`],
      ["Info", "This data is coming from mockData.js"],
    ],
  };

  session.structured = structured;

  return {
    answerText,
    structured,
    messages: session.messages,
  };
}

/**
 * Delete a session by id.
 */
function deleteSession(id) {
  const index = sessions.findIndex((s) => s.id === id);
  if (index === -1) return false;
  sessions.splice(index, 1);
  return true;
}

module.exports = {
  getSessionsList,
  getSessionById,
  createNewSession,
  getChatResponse,
  deleteSession,
};
