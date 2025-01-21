const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { Schema } = mongoose;

// Subschema for a message
const messageSchema = new Schema({
  from: { type: String, required: true },
  message: { type: String, required: true },
  sources: {type: Array, required: false},
  timestamp: {
    type: Date,
    default: () => moment.tz(Date.now(), "Asia/Manila").toDate(),
  },
});

// Main schema for chat
const chatSchema = new Schema({
  messages: [messageSchema],
});

// Create a model from the schema
const Conversation =
  mongoose.models.Conversation || mongoose.model("Conversation", chatSchema);

module.exports = Conversation;
