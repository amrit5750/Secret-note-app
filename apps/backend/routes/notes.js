const mongoose = require("mongoose"); // 👈 you use mongoose.isValidObjectId

const Note = require("../models/Note");
const Crypto = require("crypto");

const encrypt = (text, password) => {
  const iv = Crypto.randomBytes(16);
  const secret = password || process.env.AES_SECRET;
  const key = Crypto.scryptSync(secret, "salt", 32);
  const cipher = Crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

const decrypt = (encryptedText, password) => {
  const [ivHex, dataHex] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(dataHex, "hex");
  const secret = password || process.env.AES_SECRET;
  const key = Crypto.scryptSync(secret, "salt", 32);
  const decipher = Crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
};

const looksCipher = (s) =>
  typeof s === "string" && /^[0-9a-f]{32}:[0-9a-f]+$/i.test(s);

const effectiveProtection = (note) => {
  if (note.protection) return note.protection;
  // Back-compat inference:
  if (note.encrypted) return "password"; // old meaning in your app
  if (looksCipher(note.content)) return "server";
  return "none";
};

module.exports = [
  {
    method: "POST",
    path: "/api/notes",
    handler: async (req, h) => {
      const {
        text,
        password,
        destroyAfterRead,
        destroyAfterDuration,
        replyTo,
      } = req.payload;

      const protection = password ? "password" : "server";
      // encrypt() already uses AES_SECRET when password is falsy
      const content = encrypt(text, password);

      const value = destroyAfterDuration?.value ?? 24;
      const unit = destroyAfterDuration?.unit ?? "hours";
      const durationMs =
        unit === "days" ? value * 24 * 60 * 60 * 1000 : value * 60 * 60 * 1000;

      const note = await Note.create({
        content,
        encrypted: protection === "password", // legacy flag (true only for password-protected)
        protection,
        viewed: false,
        expiresAt: new Date(Date.now() + durationMs),
        replyTo: replyTo || null,
      });

      return { id: note.id };
    },
  },
  {
    method: "POST",
    path: "/api/notes/{id}",
    handler: async (req, h) => {
      const { id } = req.params;
      const { password } = req.payload || {};

      if (!mongoose.isValidObjectId(id)) {
        return h.response({ error: "not_found" }).code(404);
      }

      const note = await Note.findById(id);
      if (!note) return h.response({ error: "not_found" }).code(404);

      const now = new Date();
      const prot = effectiveProtection(note);

      if (note.viewed) {
        return h
          .response({
            error: "expired",
            viewed: true,
            wasProtection: prot,
            viewedAt: note.expiresAt || now,
          })
          .code(410);
      }
      if (note.expiresAt && note.expiresAt <= now) {
        return h
          .response({
            error: "expired",
            viewed: false,
            wasProtection: prot,
            expiredAt: note.expiresAt,
          })
          .code(410);
      }

      try {
        let content;
        if (prot === "password") {
          if (!password)
            return h.response({ error: "invalid_password" }).code(401);
          content = decrypt(note.content, password);
        } else if (prot === "server") {
          content = decrypt(note.content); // decrypt using AES_SECRET (no password)
        } else {
          content = note.content; // none (plain)
        }

        note.viewed = true;
        note.content = null;
        note.expiresAt = new Date(); // view time
        // await note.save();

        return { content };
      } catch {
        return h.response({ error: "invalid_password" }).code(401);
      }
    },
  },

  // Meta: used by the confirmation screen before revealing
  {
    method: "GET",
    path: "/api/notes/{id}/meta",
    handler: async (req, h) => {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return h.response({ error: "not_found" }).code(404);
      }

      const note = await Note.findById(id).lean();
      if (!note) return h.response({ error: "not_found" }).code(404);

      const now = new Date();
      const prot = effectiveProtection(note);

      if (note.viewed) {
        return h
          .response({
            error: "expired",
            viewed: true,
            wasProtection: prot,
            viewedAt: note.expiresAt || now,
            createdAt: note.createdAt,
          })
          .code(410);
      }

      if (note.expiresAt && note.expiresAt <= now) {
        return h
          .response({
            error: "expired",
            viewed: false,
            wasProtection: prot,
            expiredAt: note.expiresAt,
            createdAt: note.createdAt,
          })
          .code(410);
      }

      return {
        protection: prot, // 'password' | 'server' | 'none'
        requiresPassword: prot === "password", // keep existing consumer happy
        createdAt: note.createdAt,
        expiresAt: note.expiresAt,
      };
    },
  },
];
