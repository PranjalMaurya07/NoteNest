const Note = require("../models/note");
const path = require("path");

// Create-new-note
const handleAddNotesController = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).send({
        success: false,
        message: "Title and content are required",
      });
    }

    const user = req.user._id;

    const newNote = new Note({
      user,
      title,
      content,
    });
    await newNote.save();
    res.status(201).send({
      success: true,
      message: "Note added successfully",
      note: newNote, 
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error during adding notes",
      error: error.message,
    });
  }
};

// Get-all-notes 
const handleGetNotesController = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (notes.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No notes found for this user",
      });
    }

    res.status(200).send({
      success: true,
      message: "Notes fetched successfully",
      notes,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error during getting notes",
      error: error.message,
    });
  }
};

// Delete-notes
const handleDeleteNotesController = async (req, res) => {
  try {
    const noteId = req.params.id;
    await Note.findByIdAndDelete(noteId);
    res.status(200).send({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting note",
      error: error.message,
    });
  }
};

// Update-notes
const handleUpdateNotesController = async (req, res) => {
  try {
    const noteId = req.params.id;
    const updatedData = req.body;
    const updatedNote = await Note.findByIdAndUpdate(noteId, updatedData, {
      new: true,
    });

    res.status(200).send({
      success: true,
      message: "Note updated successfully",
      updatedNote,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating note",
      error: error.message,
    });
  }
};

// Make note favorite
const handleUpdateFavoriteController = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    note.favorite = !note.favorite;
    await note.save();

    res
      .status(200)
      .json({ success: true, message: "Favorite status updated", note });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Upload-image
const handleUploadImageController = async (req, res) => {
  const noteId = req.params.id;
  const file = req.file;

  try {
    if (!file) return res.status(400).json({ message: "No image uploaded" });

    const imageUrl = `/uploads/${file.filename}`; 

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found!" });

    note.image = imageUrl;
    await note.save();

    res.status(200).json({ message: "Image uploaded successfully!", note });
  } catch (err) {
    res.status(500).json({ message: "Error uploading image", error: err });
  }
};

module.exports = {
  handleAddNotesController,
  handleGetNotesController,
  handleDeleteNotesController,
  handleUpdateNotesController,
  handleUpdateFavoriteController,
  handleUploadImageController,
};
