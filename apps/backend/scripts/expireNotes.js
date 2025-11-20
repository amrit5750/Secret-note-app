require("dotenv").config();
const mongoose = require("mongoose");
const Note = require("../models/Note");

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const now = new Date();

    const result = await Note.updateMany(
      {
        expiresAt: { $lt: now },
        viewed: false,
      },
      {
        $set: { viewed: true, content: "" },
      }
    );

    console.log(`✅ Marked ${result.modifiedCount} notes as viewed`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to mark notes as viewed:", err);
    process.exit(1);
  }
})();
