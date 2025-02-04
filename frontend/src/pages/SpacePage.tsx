import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaClipboard } from "react-icons/fa";
interface Testimonial {
  id: number;
  name: string;
  email: string;
  content: string;
  image: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const SpacePage = () => {
  const { spaceName } = useParams<{ spaceName: string }>();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("testimonials");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/space/${spaceName}`);
        const { data } = response;
        setTestimonials(data.testimonials || []);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching space:", error);
        setLoading(false);
      }
    };
    fetchSpace();
  }, [spaceName]);

  if (loading) {
    return (
      <div className="w-full bg-slate-900 h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const embedCode = `<iframe src="${FRONTEND_URL}/embed/testimonials/${spaceName}" width="100%" height="600" frameborder="0" style="border:0; overflow:hidden;" allowfullscreen></iframe>`;
  const testimonialLink = `${FRONTEND_URL}/testimonial/${spaceName}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div className="w-full bg-slate-900 h-screen p-8">
      <div className="text-white text-3xl mb-4 border-b border-gray-800 px-8 pb-8">
        {spaceName}
      </div>
      <div className="flex">
        <div className="w-1/4">
          <div className="mb-4">
            <button
              className={`w-full px-4 py-2 mb-2 text-white ${
                activeTab === "testimonials" ? "bg-gray-800 rounded" : ""
              }`}
              onClick={() => setActiveTab("testimonials")}
            >
              Testimonials
            </button>
            <button
              className={`w-full px-4 py-2 mb-2 text-white ${
                activeTab === "link" ? "bg-gray-800 rounded" : ""
              }`}
              onClick={() => setActiveTab("link")}
            >
              Link to Testimonials Page
            </button>
            <button
              className={`w-full px-4 py-2 text-white ${
                activeTab === "embed" ? "bg-gray-800 rounded" : ""
              }`}
              onClick={() => setActiveTab("embed")}
            >
              Embed Code
            </button>
          </div>
        </div>
        <div className="w-3/4 pl-8">
          {activeTab === "testimonials" &&
            (testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center mb-4">
                      {testimonial.image && (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                      )}
                      <div>
                        <div className="text-white text-lg font-semibold">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {testimonial.email}
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-base">
                      {testimonial.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white text-3xl font-semibold text-center">
                No testimonials yet
              </div>
            ))}
          {activeTab === "link" && (
            <div className="text-white">
              <p className="mb-2">Link to Testimonials Page:</p>
              <div className="flex items-center space-x-2">
                <a
                  href={testimonialLink}
                  className="text-blue-500 underline break-all"
                >
                  {testimonialLink}
                </a>
                <button
                  onClick={() => copyToClipboard(testimonialLink)}
                  className="text-gray-400 hover:text-white p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                  title="Copy to clipboard"
                >
                  <FaClipboard />
                </button>
              </div>
            </div>
          )}
          {activeTab === "embed" && (
            <div>
              <h3 className="text-white text-2xl font-semibold mb-4">
                Embed Code
              </h3>
              <textarea
                readOnly
                value={embedCode}
                className="w-full p-4 rounded bg-gray-800 text-white focus:outline-none"
                rows={4}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpacePage;
