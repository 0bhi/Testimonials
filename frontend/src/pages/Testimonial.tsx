import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

interface Space {
  id: string;
  spaceName: string;
  headerTitle: string;
  customMessage: string;
}

const Testimonial = () => {
  const { spaceName } = useParams<{ spaceName: string }>();
  const [space, setSpace] = useState<Space | null>(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [mediaName, setMediaName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const response = await api.getPublicSpace(spaceName!);
        const data = await response.json();
        setSpace(data);
      } catch (error) {
        console.error("Error fetching space:", error);
      }
    };

    fetchSpace();
  }, [spaceName]);

  const handleMediaFile = (file: File | null) => {
    if (!file) return;

    setMediaName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("Please write your feedback before submitting.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.submitTestimonial(spaceName!, {
        content: trimmedContent,
        image: image || undefined,
        email,
        name,
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setError("Failed to submit testimonial. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {submitted ? (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-3 text-white">
            Thank you for your submission!
          </h2>
          <p className="text-gray-300">Your testimonial has been submitted.</p>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl shadow-xl w-full max-w-xl">
          {space && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-white text-center">
                {space.headerTitle}
              </h2>
              <p className="text-gray-300 mb-4 text-center">
                {space.customMessage}
              </p>
            </>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <label className="text-gray-300 mb-2 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-gray-300 mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-gray-300 mb-2 block">Your Feedback</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                placeholder="Share your experience or feedback..."
                required
              />
            </div>
            <div>
              <label className="text-gray-300 mb-2 block">
                Image or Video (optional)
              </label>
              <div
                className={`w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-slate-800/60"
                    : "border-gray-700 bg-slate-800/40 hover:border-blue-500 hover:bg-slate-800/60"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    handleMediaFile(file);
                  }
                }}
                onClick={() => {
                  const input = document.getElementById(
                    "media-input"
                  ) as HTMLInputElement | null;
                  input?.click();
                }}
              >
                <p className="text-gray-300 mb-1">
                  Drag & drop an image or video here, or click to browse
                </p>
                {mediaName && (
                  <p className="text-xs text-blue-400 mt-2">
                    Selected: {mediaName}
                  </p>
                )}
              </div>
              <input
                id="media-input"
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleMediaFile(file);
                }}
              />
            </div>
            {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
            >
              {loading ? "Submitting..." : "Submit Testimonial"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Testimonial;
