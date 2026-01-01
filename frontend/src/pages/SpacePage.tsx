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
import TemplatePreview from "../components/TemplatePreview";

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
  const [selectedTestimonials, setSelectedTestimonials] = useState<string[]>(
    []
  );
  const [savingSelection, setSavingSelection] = useState(false);

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
        setSelectedTestimonials(data.selectedTestimonials || []);
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

  const embedCode = `<iframe src="${FRONTEND_URL}/embed/testimonials/${spaceName}" width="100%" height="600" frameborder="0" style="border:0; overflow:hidden;" allowfullscreen></iframe>

<!-- Optional: Add URL parameters for customization -->
<!-- Limit testimonials: ?limit=6 -->
<!-- Pagination: ?limit=6&page=1 -->
<!-- Example: src="${FRONTEND_URL}/embed/testimonials/${spaceName}?limit=6" -->`;
  const testimonialLink = `${FRONTEND_URL}/testimonial/${spaceName}`;

  // Create sample testimonials for preview
  const sampleTestimonials: TemplateTestimonial[] =
    testimonials.length > 0
      ? testimonials.slice(0, 4).map((t) => ({
          id: t.id,
          name: t.name,
          email: t.email,
          content: t.content,
          image: t.image,
        }))
      : [
          {
            id: "1",
            name: "Sarah Johnson",
            email: "sarah@example.com",
            content:
              "This is a sample testimonial to preview how the template will look with your testimonials. The design showcases customer feedback beautifully.",
            image: "",
          },
          {
            id: "2",
            name: "Michael Chen",
            email: "michael@example.com",
            content:
              "Another sample testimonial to help you visualize the template design. This demonstrates how multiple testimonials appear together.",
            image: "",
          },
          {
            id: "3",
            name: "Emily Rodriguez",
            email: "emily@example.com",
            content:
              "A third sample testimonial showing the layout with different content lengths. This helps you see how the template adapts to various testimonial styles.",
            image: "",
          },
          {
            id: "4",
            name: "David Thompson",
            email: "david@example.com",
            content:
              "This fourth testimonial is useful for templates that display multiple cards in a grid layout, giving you a complete preview of the design.",
            image: "",
          },
        ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const handleTestimonialToggle = (testimonialId: string) => {
    setSelectedTestimonials((prev) => {
      if (prev.includes(testimonialId)) {
        return prev.filter((id) => id !== testimonialId);
      } else {
        return [...prev, testimonialId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTestimonials.length === testimonials.length) {
      setSelectedTestimonials([]);
    } else {
      setSelectedTestimonials(testimonials.map((t) => t.id));
    }
  };

  const handleSaveSelection = async () => {
    try {
      setSavingSelection(true);
      const token = session?.accessToken || null;
      await api.updateSelectedTestimonials(
        spaceName!,
        selectedTestimonials,
        token
      );
      alert("Selection saved successfully!");
    } catch (error) {
      console.error("Error saving selection:", error);
      alert("Failed to save selection. Please try again.");
    } finally {
      setSavingSelection(false);
    }
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
                  className={`w-full px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
                    activeTab === "select"
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                  onClick={() => setActiveTab("select")}
                >
                  Select for Embed
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

              {activeTab === "select" && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <div className="mb-6">
                    <h3 className="text-white text-2xl font-semibold mb-2">
                      Select Testimonials for Embedding
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Choose which testimonials will be displayed in your
                      embedded widget. If none are selected, all testimonials
                      will be shown.
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-gray-300 text-sm">
                        {selectedTestimonials.length} of {testimonials.length}{" "}
                        selected
                      </div>
                      <button
                        onClick={handleSelectAll}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                      >
                        {selectedTestimonials.length === testimonials.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>
                    <button
                      onClick={handleSaveSelection}
                      disabled={savingSelection}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {savingSelection ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        "Save Selection"
                      )}
                    </button>
                  </div>
                  {testimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {testimonials.map((testimonial) => {
                        const isSelected = selectedTestimonials.includes(
                          testimonial.id
                        );
                        return (
                          <div
                            key={testimonial.id}
                            className={`bg-white/5 border rounded-xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-white/10"
                            }`}
                            onClick={() =>
                              handleTestimonialToggle(testimonial.id)
                            }
                          >
                            <div className="flex items-start gap-3 mb-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  handleTestimonialToggle(testimonial.id)
                                }
                                onClick={(e) => e.stopPropagation()}
                                className="mt-1 w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                              />
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  {testimonial.image && (
                                    <img
                                      src={testimonial.image}
                                      alt={testimonial.name}
                                      className="w-10 h-10 rounded-full mr-3"
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
                              </div>
                            </div>
                            <div className="text-gray-300 text-sm whitespace-pre-line leading-relaxed break-words line-clamp-3">
                              {testimonial.content}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-white text-2xl font-semibold text-center">
                      No testimonials yet
                    </div>
                  )}
                </div>
              )}

              {activeTab === "templates" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {getAllTemplates().map((template) => {
                      const TemplateComponent = template.component;
                      const isSelected = selectedTemplate === template.id;
                      return (
                        <div
                          key={template.id}
                          className="flex flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                        >
                          {/* Title and Description Section */}
                          <div className="mb-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="text-white text-xl font-semibold">
                                {template.name}
                              </h3>
                              {isSelected && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium uppercase tracking-wide flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                                  <svg
                                    className="w-3 h-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  SELECTED
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                              {template.description}
                            </p>
                          </div>

                          {/* Preview Box */}
                          <div className="bg-slate-900 rounded-lg overflow-hidden mb-4 border border-slate-700 h-[450px] shadow-inner relative">
                            <TemplatePreview templateId={template.id}>
                              <TemplateComponent
                                testimonials={sampleTestimonials}
                              />
                            </TemplatePreview>
                          </div>

                          {/* Select Button */}
                          <button
                            onClick={() => handleTemplateSelect(template.id)}
                            disabled={isSelected || updatingTemplate}
                            className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                              isSelected
                                ? "bg-blue-600/60 text-white cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/20"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {isSelected ? (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Currently Selected
                              </>
                            ) : updatingTemplate ? (
                              <>
                                <svg
                                  className="animate-spin w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Updating...
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Select Template
                              </>
                            )}
                          </button>
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
                  <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-300 text-sm mb-2 font-semibold">
                      💡 Tips for embedding:
                    </p>
                    <ul className="text-blue-200 text-xs space-y-1 list-disc list-inside">
                      <li>
                        Only selected testimonials (from "Select for Embed" tab)
                        will be shown in the embed
                      </li>
                      <li>Adjust the height attribute to fit your content</li>
                      <li>
                        Use{" "}
                        <code className="bg-blue-500/20 px-1 rounded">
                          ?limit=6
                        </code>{" "}
                        to show only 6 testimonials
                      </li>
                      <li>
                        Use{" "}
                        <code className="bg-blue-500/20 px-1 rounded">
                          ?limit=6&page=2
                        </code>{" "}
                        for pagination
                      </li>
                      <li>
                        Remove height for auto-sizing (works best with grid
                        templates)
                      </li>
                    </ul>
                  </div>
                  <textarea
                    readOnly
                    value={embedCode}
                    className="w-full p-4 rounded bg-slate-800 text-white border border-gray-700 focus:outline-none font-mono text-sm"
                    rows={8}
                  />
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => copyToClipboard(embedCode)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:from-blue-700 hover:to-blue-800"
                    >
                      Copy Embed Code
                    </button>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `<iframe src="${FRONTEND_URL}/embed/testimonials/${spaceName}?limit=6" width="100%" height="600" frameborder="0" style="border:0; overflow:hidden;" allowfullscreen></iframe>`
                        )
                      }
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Copy with Limit (6)
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
