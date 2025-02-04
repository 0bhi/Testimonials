import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Space {
  id: number;
  spaceName: string;
  headerTitle: string;
  customMessage: string;
  question1: string;
  question2: string;
  question3: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Testimonial = () => {
  const { spaceName } = useParams<{ spaceName: string }>();
  const [space, setSpace] = useState<Space | null>(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/space/${spaceName}`);
        setSpace(response.data);
      } catch (error) {
        console.error("Error fetching space:", error);
      }
    };

    fetchSpace();
  }, [spaceName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const testimonialData = {
      content,
      image,
      email,
      name,
      spaceId: space ? space.id : null,
    };

    try {
      console.log("Testimonial data:", testimonialData);
      await axios.post(`${BACKEND_URL}/space/${spaceName}`, testimonialData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error("Error submitting testimonial:", error);
    } finally {
      setSubmitted(true);
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
            <button
              type="submit"
              className="bg-blue-800 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Testimonial
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Testimonial;
