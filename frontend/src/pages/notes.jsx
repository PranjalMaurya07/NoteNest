
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../components/modals"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateNotes from "../components/createNotes"; 
import "../styles/notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isNoteViewModalOpen, setIsNoteViewModalOpen] = useState(false); 
  const [currentNote, setCurrentNote] = useState(null);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const res = await axios.get("https://notenest-backend-5sz3.onrender.com/api/get-notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.notes);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        console.error("Error fetching notes:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast.success("Logged out successfully.");
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Note copied to clipboard!");
  };

  const deleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      await axios.delete(`https://notenest-backend-5sz3.onrender.com/api/delete-notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Note deleted successfully!");
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error("Error deleting note.");
    }
  };

  const renameNote = async (noteId, newTitle, newContent) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      await axios.put(
        `https://notenest-backend-5sz3.onrender.com/api/update-notes/${noteId}`,
        { title: newTitle, content: newContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Note updated successfully!");
      fetchNotes();
    } catch (err) {
      console.error("Error updating note:", err);
      toast.error("Error updating note.");
    }
  };

  const toggleFavorite = async (noteId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");

      await axios.put(
        `https://notenest-backend-5sz3.onrender.com/api/notes/favorite/${noteId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Favorite status updated!");
      fetchNotes();
    } catch (err) {
      console.error("Error updating favorite status:", err);
      toast.error("Error updating favorite status.");
    }
  };

  const uploadImage = async (noteId, imageFile) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      await axios.put(
        `https://notenest-backend-5sz3.onrender.com/api/notes/upload-image/${noteId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Image uploaded successfully!");
      fetchNotes();
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Error uploading image.");
    }
  };

  const openModal = (note) => {
    setCurrentNote(note);
    setIsModalOpen(false);
    setIsNoteViewModalOpen(true); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNote(null);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="notes-container">
      <h2>Your Notes</h2>

      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* Button to open the Create Notes modal */}
      <button
        className="create-note-button"
        onClick={() => setIsModalOpen(true)}
      >
        Create New Note
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CreateNotes fetchNotes={fetchNotes} closeModal={closeModal}/>
            <button
              className="close-modal-button"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Display All Notes */}
      <div className="notes-list">
        {notes.length > 0 ? (
          notes
            .filter(
              (note) =>
                note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.content.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((note) => (
              <div className="note-card" key={note._id}>
                <div className="note-card-header">
                  <h3>{note.title}</h3>
                  <button
                    onClick={() => toggleFavorite(note._id)}
                    className={`favorite-button ${
                      note.favorite ? "favorited" : ""
                    }`}
                  >
                    {note.favorite ? "⭐ Unfavorite" : "☆ Favorite"}
                  </button>
                </div>
                <p>{note.content}</p>

                <div className="note-card-actions">
                  <button
                    onClick={() => copyToClipboard(note.content)}
                    className="action-button"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="delete-button action-button"
                  >
                    Delete Note
                  </button>
                  <button
                    onClick={() => openModal(note)}
                    className="view-button action-button"
                  >
                    View Note
                  </button>
                </div>
              </div>
            ))
        ) : (
          <p>No notes found!</p>
        )}
      </div>

      

      {isNoteViewModalOpen && (
        <Modal
          note={currentNote}
          onClose={closeModal}
          onRename={renameNote}
          onDelete={deleteNote}
          onToggleFavorite={toggleFavorite}
          onImageUpload={uploadImage}
        />
      )}

      {/* Create Notes Modal */}
      

      {/* ToastContainer to display the pop-up notifications */}
      <ToastContainer />
    </div>
  );
};

export default Notes;
