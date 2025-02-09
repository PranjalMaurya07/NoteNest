const express = require("express");
const { handleUpdateFavoriteController, handleUploadImageController } = require("../controllers/notesControllers");
const { auth } = require("../middlewares/auth");
const upload = require("../middlewares/uploadImage");
const router = express.Router();

// Route-to-mark-favorite
router.put("/favorite/:id",auth, handleUpdateFavoriteController);

// Route-to-upload-image
router.put("/upload-image/:id",auth, upload.single("image"), handleUploadImageController);

module.exports = router;
