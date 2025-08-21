import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

interface Space {
  id: string;
  spaceName: string;
  headerTitle: string;
  customMessage: string;
  question1: string;
  question2: string;
  question3: string;
}

const Testimonial = () => {
  const { spaceName } = useParams<{ spaceName: string }>();
  const [space, setSpace] = useState<Space | null>(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      await api.submitTestimonial(spaceName!, {
        content,
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
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                <p className="text-gray-200 mb-2">{space.question1}</p>
                <p className="text-gray-200 mb-2">{space.question2}</p>
                <p className="text-gray-200">{space.question3}</p>
              </div>
            </>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <label className="text-gray-300 mb-2 block">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                required
              />
            </div>
            <div>
              <label className="text-gray-300 mb-2 block">Image URL</label>
              <input
                type="text"
                value={image || ""}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="text-gray-300 mb-2 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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
