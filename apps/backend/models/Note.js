// models/Note.js
const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  content: String,
  encrypted: Boolean, // legacy flag; keep for back-compat
  viewed: Boolean,
  expiresAt: Date,
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // NEW: how the note is protected
  // - 'password' → user must provide a password
  // - 'server'   → encrypted with AES_SECRET (no password prompt)
  // - 'none'     → plain text (not recommended)
  protection: {
    type: String,
    enum: ["password", "server", "none"],
    default: "server", // sensible default; your app encrypts even without a password
  },
});

const looksCipher = (s) =>
  typeof s === "string" && /^[0-9a-f]{32}:[0-9a-f]+$/i.test(s);

const effectiveProtection = (note) => {
  if (note.protection) return note.protection;
  // Back-compat inference:
  if (note.encrypted) return "password"; // old meaning in your app
  if (looksCipher(note.content)) return "server";
  return "none";
};

module.exports = mongoose.model("Note", NoteSchema);
