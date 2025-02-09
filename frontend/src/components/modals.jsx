import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import '../styles/modals.css';

const Modal = ({ note, onClose, onRename, onDelete, onToggleFavorite, onImageUpload }) => {
  if (!note) return null;  

  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    setEditedTitle(note.title);
    setEditedContent(note.content);
  }, [note]);

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  const handleSave = () => {
    if (editedTitle !== note.title || editedContent !== note.content) {
      onRename(note._id, editedTitle, editedContent);
      toast.success("Note updated successfully!");
    }
    onClose();
  };

  const handleDelete = () => {
    onDelete(note._id);
    toast.success("Note deleted successfully!");
    onClose();
  };

  const handleFavoriteToggle = () => {
    onToggleFavorite(note._id);
    toast.success("Favorite status updated!");
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(note._id, file);  
      toast.success("Image uploaded successfully!");
    }
  };

  return (
    <div className={isFullScreen ? 'modal full-screen' : 'modal'}>
      <button onClick={toggleFullScreen} className="modal__fullscreen-button">
        {isFullScreen ? "Exit Full Screen" : "View Full Screen"}
      </button>

      <h2>Edit Note</h2>

      <input
        type="text"
        value={editedTitle}
        onChange={handleTitleChange}
        className="modal__input"
      />

      <textarea
        value={editedContent}
        onChange={handleContentChange}
        className="modal__textarea"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="modal__image-upload"
      />
      {note.image && <img src={`https://notenest-backend-5sz3.onrender.com/${note.image}`} alt="Note" className="modal__image-preview" />}

      <div className="modal__button-container">
        <button onClick={handleSave} className="modal__button modal__button--save">
          Save Changes
        </button>

        <button onClick={handleDelete} className="modal__button modal__button--delete">
          Delete Note
        </button>

        <button
          onClick={handleFavoriteToggle}
          className={`modal__button modal__button--favorite ${note.favorite ? 'favorited' : ''}`}
        >
          {note.favorite ? "⭐ Unfavorite" : "☆ Favorite"}
        </button>

        <button onClick={onClose} className="modal__button modal__button--close">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
