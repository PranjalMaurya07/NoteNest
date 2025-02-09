import React from "react";
import '../styles/notesCard.css'

const NoteCard = ({ note, onDelete, onRename, onToggleFavorite, onEdit }) => {
  const handleDelete = () => {
    onDelete(note._id); 
  };

  const handleRename = () => {
    const newTitle = prompt("Enter new title", note.title);
    const newContent = prompt("Enter new content", note.content);
    if (newTitle && newContent) {
      onRename(note._id, newTitle, newContent); 
    }
  };

  const handleToggleFavorite = () => {
    onToggleFavorite(note._id); 
  };

  const handleEdit = () => {
    onEdit(); 
  };

  return (
    <div className="note-card">
      <div className="note-header">
        <h4>{note.title}</h4>
        <button onClick={handleToggleFavorite}>
          {note.favorite ? "⭐ Unfavorite" : "☆ Favorite"}
        </button>
      </div>
      <p>{note.content}</p>

      <div className="note-actions">
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default NoteCard;
