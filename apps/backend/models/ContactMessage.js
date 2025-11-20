const mongoose = require("mongoose");

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 80 },
  email: { type: String, required: true, maxlength: 254, index: true },
  message: { type: String, required: true, maxlength: 5000 },
  ip: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now, index: true },
});

module.exports =
  mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", ContactMessageSchema);
