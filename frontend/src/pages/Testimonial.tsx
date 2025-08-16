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
    <div className="w-full bg-slate-900 h-screen flex items-center justify-center p-4">
      {submitted ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Thank you for your submission!
          </h2>
          <p className="text-center text-gray-600">
            Your testimonial has been submitted.
          </p>
        </div>
      ) : (
        <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-full max-w-lg">
          {space && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center text-white">
                {space.headerTitle}
              </h2>
              <p className="text-white mb-4">{space.customMessage}</p>
              <p className="text-white mb-2">{space.question1}</p>
              <p className="text-white mb-2">{space.question2}</p>
              <p className="text-white mb-4">{space.question3}</p>
            </>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <label className="text-white mb-2 block">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-white mb-2 block">Image URL</label>
              <input
                type="text"
                value={image || ""}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-white mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-white mb-2 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-800 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
