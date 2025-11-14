import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { PenSquareIcon, Trash2Icon, ArrowLeftIcon } from "lucide-react";
import { formatDate } from "../lib/utils.jsx";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import NavBar from "../components/NavBar";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
        setLoading(false);
      } catch (error){
        console.error("Error fetching note:", error);
        toast.error("Failed to fetch note");
        setLoading(false);
      }finally{
        setLoading(false);
      }
    };
    fetchNotes();
  },[id]);

    const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    }
  };
  const [saving, setSaving] = useState(false);

  const handleSave  = async () => {
      if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }
    setSaving(true);
    try {
      const res = await api.put(`/notes/${id}`, { title, content });
      setNote(res.data);
      setIsEditing(false);
      toast.success("Note updated successfully");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }   
  };

  
  if (loading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="text-center py-10 text-primary">Loading...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="text-center py-10">Note not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="max-w-2xl mx-auto p-4 mt-8">
        <button
          onClick={() => navigate("/")}
          className="btn btn-ghost btn-sm mb-4"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </button>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {!isEditing ? (
              <>
                <h1 className="card-title text-3xl mb-2">{note.title}</h1>
                <p className="text-base-content/60 mb-4">
                  {formatDate(new Date(note.createdAt))}
                </p>
                <div className="prose prose-invert max-w-none mb-6">
                  <p className="whitespace-pre-wrap">{note.content}</p>
                </div>
                <div className="card-actions justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                  >
                    <PenSquareIcon className="size-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn btn-error"
                  >
                    <Trash2Icon className="size-4" />
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="textarea textarea-bordered h-48"
                  ></textarea>
                </div>
                <div className="card-actions justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;