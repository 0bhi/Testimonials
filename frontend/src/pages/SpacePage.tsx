import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaClipboard } from "react-icons/fa";
import { api } from "../services/api";
import { useSession } from "../contexts/AuthContext";
import {
  getAllTemplates,
  getTemplate,
  Testimonial as TemplateTestimonial,
} from "../templates";
import config from "../config/env";

const FRONTEND_URL = config.frontendUrl;

interface Testimonial {
  id: string;
  name: string;
  email: string;
  content: string;
  image: string;
}

interface Space {
  id: string;
  spaceName: string;
  template?: string;
  [key: string]: any;
}

const SpacePage = () => {
  const { spaceName } = useParams<{ spaceName: string }>();
  const { data: session } = useSession();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("testimonials");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern");
  const [updatingTemplate, setUpdatingTemplate] = useState(false);

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
        setSpace(data);
        setSelectedTemplate(data.template || "modern");
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

  const handleTemplateSelect = async (templateId: string) => {
    if (templateId === selectedTemplate) return;

    try {
      setUpdatingTemplate(true);
      const token = session?.accessToken || null;
      await api.updateTemplate(spaceName!, templateId, token);
      setSelectedTemplate(templateId);
      if (space) {
        setSpace({ ...space, template: templateId });
      }
    } catch (error) {
      console.error("Error updating template:", error);
      alert("Failed to update template. Please try again.");
    } finally {
      setUpdatingTemplate(false);
    }
  };

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

  const embedCode = `<iframe src="${FRONTEND_URL}/embed/testimonials/${spaceName}?template=${selectedTemplate}" width="100%" height="600" frameborder="0" style="border:0; overflow:hidden;" allowfullscreen></iframe>`;
  const testimonialLink = `${FRONTEND_URL}/testimonial/${spaceName}`;

  // Create sample testimonials for preview
  const sampleTestimonials: TemplateTestimonial[] =
    testimonials.length > 0
      ? testimonials.slice(0, 3).map((t) => ({
          id: t.id,
          name: t.name,
          email: t.email,
          content: t.content,
          image: t.image,
        }))
      : [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            content:
              "This is a sample testimonial to preview how the template will look with your testimonials.",
            image: "",
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            content:
              "Another sample testimonial to help you visualize the template design.",
            image: "",
          },
        ];

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
                  className={`w-full px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
                    activeTab === "templates"
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                  onClick={() => setActiveTab("templates")}
                >
                  Templates
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

              {activeTab === "templates" && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-white text-2xl font-semibold mb-6">
                    Choose a Template
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Select a template that matches your website's style. You can
                    preview how your testimonials will look with each template.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getAllTemplates().map((template) => {
                      const TemplateComponent = template.component;
                      const isSelected = selectedTemplate === template.id;
                      return (
                        <div
                          key={template.id}
                          className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                            isSelected
                              ? "border-blue-500 shadow-lg shadow-blue-500/50"
                              : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          <div className="bg-white/5 p-4 border-b border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white text-lg font-semibold">
                                {template.name}
                              </h4>
                              {isSelected && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                  Selected
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">
                              {template.description}
                            </p>
                          </div>
                          <div className="bg-slate-900 p-2 max-h-64 overflow-y-auto overflow-x-hidden">
                            <TemplateComponent
                              testimonials={sampleTestimonials}
                            />
                          </div>
                          <div className="bg-white/5 p-4">
                            <button
                              onClick={() => handleTemplateSelect(template.id)}
                              disabled={isSelected || updatingTemplate}
                              className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                                isSelected
                                  ? "bg-blue-600 text-white cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-700 text-white"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {isSelected
                                ? "Currently Selected"
                                : updatingTemplate
                                ? "Updating..."
                                : "Select Template"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "embed" && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-white text-2xl font-semibold mb-4">
                    Embed Code
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    Current template:{" "}
                    <span className="font-semibold text-white">
                      {getTemplate(selectedTemplate).name}
                    </span>
                  </p>
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
