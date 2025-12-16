import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaClipboard } from "react-icons/fa";
import { api } from "../services/api";
import { useSession } from "../contexts/AuthContext";

interface Testimonial {
  id: string;
  name: string;
  email: string;
  content: string;
  image: string;
}

import config from "../config/env";

const FRONTEND_URL = config.frontendUrl;

const SpacePage = () => {
  const { spaceName } = useParams<{ spaceName: string }>();
  const { data: session } = useSession();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("testimonials");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const token = session?.accessToken || null;
        const response = await api.getSpace(spaceName!, token);
        const data = await response.json();
        setTestimonials(data.testimonials || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching space:", error);
        setLoading(false);
      }
    };
    if (session) {
      fetchSpace();
    }
  }, [spaceName, session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-xl font-medium">Loading space...</div>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="px-6 py-8 lg:px-12 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              {spaceName}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2">
                <button
                  className={`w-full px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
                    activeTab === "testimonials"
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                  onClick={() => setActiveTab("testimonials")}
                >
                  Testimonials
                </button>
                <button
                  className={`w-full px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
                    activeTab === "link"
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                  onClick={() => setActiveTab("link")}
                >
                  Link to Testimonials Page
                </button>
                <button
                  className={`w-full px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === "embed"
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                  onClick={() => setActiveTab("embed")}
                >
                  Embed Code
                </button>
              </div>
            </div>
            <div className="lg:col-span-3">
              {activeTab === "testimonials" && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  {testimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {testimonials.map((testimonial) => (
                        <div
                          key={testimonial.id}
                          className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
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
                          <div className="text-gray-300 text-base whitespace-pre-line leading-relaxed break-words">
                            {testimonial.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-white text-2xl font-semibold text-center">
                      No testimonials yet
                    </div>
                  )}
                </div>
              )}

              {activeTab === "link" && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-white">
                  <p className="mb-3 text-gray-300">
                    Link to Testimonials Page:
                  </p>
                  <div className="flex items-center gap-2">
                    <a
                      href={testimonialLink}
                      className="text-blue-400 underline break-all"
                    >
                      {testimonialLink}
                    </a>
                    <button
                      onClick={() => copyToClipboard(testimonialLink)}
                      className="text-gray-300 hover:text-white p-2 rounded bg-white/10 hover:bg-white/20 transition-colors duration-200"
                      title="Copy to clipboard"
                    >
                      <FaClipboard />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "embed" && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-white text-2xl font-semibold mb-4">
                    Embed Code
                  </h3>
                  <textarea
                    readOnly
                    value={embedCode}
                    className="w-full p-4 rounded bg-slate-800 text-white border border-gray-700 focus:outline-none"
                    rows={6}
                  />
                  <div className="mt-4">
                    <button
                      onClick={() => copyToClipboard(embedCode)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:from-blue-700 hover:to-blue-800"
                    >
                      Copy Embed Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacePage;
