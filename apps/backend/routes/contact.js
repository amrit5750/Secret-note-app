const Joi = require("joi");
const ContactMessage = require("../models/ContactMessage");

const WINDOW_MS = 60 * 60 * 1000;
const MAX = 12;
const bucket = new Map();

function isLimited(ip) {
  const now = Date.now();
  const entry = bucket.get(ip) || { count: 0, reset: now + WINDOW_MS };
  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + WINDOW_MS;
  }
  entry.count++;
  bucket.set(ip, entry);
  return entry.count > MAX;
}

module.exports = [
  {
    method: "POST",
    path: "/api/contact",
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().min(2).max(80).required(),
          email: Joi.string().email().max(254).required(),
          message: Joi.string().min(5).max(5000).required(),
        }),
        failAction: (req, h, err) =>
          h
            .response({ error: "Invalid payload", details: err.details })
            .code(400)
            .takeover(),
      },
    },
    handler: async (request, h) => {
      const ip =
        request.headers["cf-connecting-ip"] ||
        (request.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
        request.info.remoteAddress ||
        "";

      if (isLimited(ip)) {
        return h.response({ error: "Too many requests" }).code(429);
      }

      const { name, email, message } = request.payload;

      await ContactMessage.create({
        name,
        email,
        message,
        ip,
        userAgent: request.headers["user-agent"] || "",
      });

      return h.response({ ok: true }).code(200);
    },
  },
];
