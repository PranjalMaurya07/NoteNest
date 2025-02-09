const express = require("express");
const {
  handleAddNotesController,
  handleGetNotesController,
  handleDeleteNotesController,
  handleUpdateNotesController,
} = require("../controllers/notesControllers");

const { auth } = require("../middlewares/auth");

const router = express.Router();

// add-notes
router.post("/add-notes", auth, handleAddNotesController);

// get-notes
router.get("/get-notes", auth, handleGetNotesController);

// delete-notes
router.delete('/delete-notes/:id',auth,handleDeleteNotesController);

// update-notes
router.put('/update-notes/:id',auth,handleUpdateNotesController);



module.exports = router;
