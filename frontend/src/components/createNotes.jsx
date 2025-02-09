import React, { useEffect, useState } from "react";
import axios from "axios";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { toast } from "react-toastify"; 
import '../styles/createNotes.css'

const CreateNotes = ({ fetchNotes, closeModal }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { transcript, isRecording, startRecording, stopRecording, resetTranscript } =
    useSpeechRecognition();

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Note copied to clipboard!");  
  };

  const handleCreateNote = async () => {
    const token = localStorage.getItem("token");
    if (!title || !content) return toast.error("Title and content are required!");

    try {
      await axios.post(
        "https://notenest-backend-5sz3.onrender.com/api/add-notes",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotes();
      setContent("");
      setTitle("");
      resetTranscript();
      closeModal();
      toast.success("Note saved successfully!"); 
    } catch (err) {
      toast.error("Failed to save the note!"); 
    }
  };

  useEffect(() => {
    if (transcript) {
      setContent(transcript); 
    }
  }, [transcript]);

  return (
    <div className="create-note-container">
      <h3>Create Note</h3>
      <input
        className="note-title-input"
        type="text"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="note-content-textarea"
        placeholder="Note Content"
        value={transcript || content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="speech-controls">
        <button
          className="start-recording-btn"
          onClick={startRecording}
          disabled={isRecording}
        >
          {isRecording ? "Recording..." : "Start Recording"}
        </button>
        <button
          className="stop-recording-btn"
          onClick={stopRecording}
          disabled={!isRecording}
        >
          Stop Recording
        </button>
      </div>
      <div className="note-actions">
        <button className="save-note-btn" onClick={handleCreateNote}>
          Save Note
        </button>
      </div>

      {/* Toast container (You can place this in your App.js if needed globally) */}
      {/* <toast.Container /> */}
    </div>
  );
};

export default CreateNotes;
