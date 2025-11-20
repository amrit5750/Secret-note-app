require("dotenv").config();
const Hapi = require("@hapi/hapi");
const mongoose = require("mongoose");
const noteRoutes = require("./routes/notes");
const cron = require("node-cron");
const Note = require("./models/Note");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const contactRoutes = require("./routes/contact");

// Ensure logs directory exists
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const accessLogStream = fs.createWriteStream(path.join(logDir, "access.log"), {
  flags: "a",
});

const init = async () => {
  // 1️⃣ Connect MongoDB
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Build an array of allowed origins from env (supports comma-separated)
  const allowedOrigins = (process.env.CORS_ORIGIN || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const server = Hapi.server({
    port: process.env.PORT || 4000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: allowedOrigins, // e.g. ["http://localhost:3000","https://cryptnote.sh"] or ["*"]
        credentials: true,
        additionalHeaders: ["Content-Type", "Authorization"],
        maxAge: 86400,
      },
    },
  });

  // 3️⃣ Logging middleware (via morgan)
  server.ext("onRequest", (request, h) => {
    morgan("combined", { stream: accessLogStream })(
      request.raw.req,
      request.raw.res,
      () => {}
    );
    return h.continue;
  });

  // 4️⃣ Routes
  await server.register({
    plugin: require("./routes/stats"),
    options: { NoteModel: Note },
  });
  server.route(noteRoutes);
  server.route(contactRoutes);

  // 5️⃣ Example cron cleanup (optional)
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily cleanup task...");
    // Your cleanup logic here
  });

  // 6️⃣ Start server
  await server.start();
  console.log(`✅ Server running at ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();

cron.schedule("*/10 * * * *", async () => {
  // Every 10 minutes
  try {
    const now = new Date();
    const result = await Note.updateMany(
      { expiresAt: { $lt: now }, viewed: false },
      { $set: { viewed: true } }
    );
    if (result.modifiedCount > 0) {
      console.log(
        `🔄 Cron: Marked ${result.modifiedCount} expired notes as viewed.`
      );
    }
  } catch (err) {
    console.error("⛔ Cron error marking notes as viewed:", err);
  }
});
