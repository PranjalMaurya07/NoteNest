const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  favorite: {
    type: Boolean,
    default: false,
  },
  image: { 
    type: String, 
    default: null 
  },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
