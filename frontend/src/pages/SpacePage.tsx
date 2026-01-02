import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { useSession } from "../contexts/AuthContext";
import {
  getAllTemplates,
  getTemplate,
  Testimonial as TemplateTestimonial,
} from "../templates";
import config from "../config/env";
import TemplatePreview from "../components/TemplatePreview";
import { motion, AnimatePresence } from "framer-motion";

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
  const [copied, setCopied] = useState(false);

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
      <div className="min-h-screen bg-apple-dark-bg flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-[3px] border-apple-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="text-body text-apple-gray-300 font-medium">
            Loading space...
          </div>
        </div>
      </div>
    );
  }

  // Build embed URL
  const buildEmbedUrl = () => {
    return `${FRONTEND_URL}/embed/testimonials/${spaceName}`;
  };

  const embedUrl = buildEmbedUrl();
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" style="border:0; overflow:hidden;" allowfullscreen></iframe>`;
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  const tabs = [
    { id: "testimonials", label: "Testimonials" },
    { id: "link", label: "Link to Testimonials Page" },
    { id: "templates", label: "Templates" },
    { id: "select", label: "Select for Embed" },
    { id: "embed", label: "Embed Code" },
  ];

  return (
    <div className="min-h-screen bg-apple-dark-bg">
      <div className="px-6 py-12 lg:px-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-headline-sm lg:text-headline font-semibold text-apple-gray-50 tracking-tight">
              {spaceName}
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card-apple p-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-4 py-3 mb-2 text-left rounded-apple transition-colors text-body-sm ${
                      activeTab === tab.id
                        ? "bg-apple-dark-elevated text-apple-gray-50 font-medium"
                        : "text-apple-gray-300 hover:bg-apple-dark-elevated"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {activeTab === "testimonials" && (
                  <motion.div
                    key="testimonials"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="card-apple"
                  >
                    {testimonials.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                          <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -4 }}
                            className="card-apple"
                          >
                            <div className="flex items-center mb-4">
                              {testimonial.image && (
                                <img
                                  src={testimonial.image}
                                  alt={testimonial.name}
                                  className="w-12 h-12 rounded-full mr-4 object-cover"
                                />
                              )}
                              <div>
                                <div className="text-title-sm font-semibold text-apple-gray-50">
                                  {testimonial.name}
                                </div>
                                <div className="text-body-sm text-apple-gray-300">
                                  {testimonial.email}
                                </div>
                              </div>
                            </div>
                            <div className="text-body-sm text-apple-gray-200 whitespace-pre-line leading-relaxed break-words">
                              {testimonial.content}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-title font-semibold text-apple-gray-50 mb-2">
                          No testimonials yet
                        </div>
                        <div className="text-body-sm text-apple-gray-300">
                          Testimonials will appear here once submitted.
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "link" && (
                  <motion.div
                    key="link"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="card-apple"
                  >
                    <p className="text-body-sm text-apple-gray-300 mb-4">
                      Link to Testimonials Page:
                    </p>
                    <div className="flex items-center gap-3 p-4 bg-apple-dark-surface rounded-apple border border-apple-dark-border">
                      <a
                        href={testimonialLink}
                        className="text-apple-blue-400 hover:text-apple-blue-300 break-all text-body-sm flex-1"
                      >
                        {testimonialLink}
                      </a>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyToClipboard(testimonialLink)}
                        className="p-2 rounded-apple bg-apple-dark-elevated hover:bg-apple-dark-surface border border-apple-dark-border transition-colors"
                        title="Copy to clipboard"
                      >
                        {copied ? (
                          <svg
                            className="w-5 h-5 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-apple-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "select" && (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="card-apple"
                  >
                    <div className="mb-6">
                      <h3 className="text-title font-semibold text-apple-gray-50 mb-2">
                        Select Testimonials for Embedding
                      </h3>
                      <p className="text-body-sm text-apple-gray-300 mb-4">
                        Choose which testimonials will be displayed in your
                        embedded widget. If none are selected, all testimonials
                        will be shown.
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-body-sm text-apple-gray-300">
                          {selectedTestimonials.length} of {testimonials.length}{" "}
                          selected
                        </div>
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSelectAll}
                            className="text-body-sm text-apple-blue-400 hover:text-apple-blue-300 font-medium transition-colors"
                          >
                            {selectedTestimonials.length === testimonials.length
                              ? "Deselect All"
                              : "Select All"}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSaveSelection}
                            disabled={savingSelection}
                            className="btn-apple-primary text-body-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                          </motion.button>
                        </div>
                      </div>
                    </div>
                    {testimonials.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((testimonial) => {
                          const isSelected = selectedTestimonials.includes(
                            testimonial.id
                          );
                          return (
                            <motion.div
                              key={testimonial.id}
                              whileHover={{ y: -4 }}
                              className={`card-apple cursor-pointer transition-all ${
                                isSelected
                                  ? "ring-2 ring-apple-blue-500 bg-apple-blue-900/20"
                                  : ""
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
                                  className="mt-1 w-5 h-5 text-apple-blue-500 bg-apple-dark-surface border-apple-dark-border rounded focus:ring-apple-blue-500 focus:ring-2 cursor-pointer"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center mb-2">
                                    {testimonial.image && (
                                      <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-10 h-10 rounded-full mr-3 object-cover"
                                      />
                                    )}
                                    <div>
                                      <div className="text-title-sm font-semibold text-apple-gray-50">
                                        {testimonial.name}
                                      </div>
                                      <div className="text-body-sm text-apple-gray-300">
                                        {testimonial.email}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-body-sm text-apple-gray-200 whitespace-pre-line leading-relaxed break-words line-clamp-3">
                                {testimonial.content}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-title font-semibold text-apple-gray-50 mb-2">
                          No testimonials yet
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "templates" && (
                  <motion.div
                    key="templates"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {getAllTemplates().map((template) => {
                      const TemplateComponent = template.component;
                      const isSelected = selectedTemplate === template.id;
                      return (
                        <motion.div
                          key={template.id}
                          whileHover={{ y: -4 }}
                          className="card-apple"
                        >
                          <div className="mb-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="text-title font-semibold text-apple-gray-50">
                                {template.name}
                              </h3>
                              {isSelected && (
                                <span className="bg-apple-blue-600 text-white text-caption px-3 py-1 rounded-full font-medium uppercase tracking-wide flex items-center gap-1 whitespace-nowrap flex-shrink-0">
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
                            <p className="text-body-sm text-apple-gray-300 leading-relaxed">
                              {template.description}
                            </p>
                          </div>

                          <div className="bg-apple-dark-bg rounded-apple-lg overflow-hidden mb-4 border border-apple-dark-border h-[450px] shadow-apple-inset relative">
                            <TemplatePreview templateId={template.id}>
                              <TemplateComponent
                                testimonials={sampleTestimonials}
                              />
                            </TemplatePreview>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleTemplateSelect(template.id)}
                            disabled={isSelected || updatingTemplate}
                            className={`w-full py-3 rounded-apple-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                              isSelected
                                ? "bg-apple-dark-elevated text-apple-gray-400 cursor-not-allowed border border-apple-dark-border"
                                : "btn-apple-primary"
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
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}

                {activeTab === "embed" && (
                  <motion.div
                    key="embed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="card-apple space-y-6"
                  >
                    <div>
                      <h3 className="text-title font-semibold text-apple-gray-50 mb-2">
                        Embed Code
                      </h3>
                      <p className="text-body-sm text-apple-gray-400">
                        Current template:{" "}
                        <span className="font-semibold text-apple-gray-50">
                          {getTemplate(selectedTemplate).name}
                        </span>
                      </p>
                    </div>

                    {/* Preview URL */}
                    <div>
                      <label className="block text-body-sm font-medium text-apple-gray-300 mb-2">
                        Preview URL
                      </label>
                      <div className="p-3 bg-apple-dark-surface rounded-apple border border-apple-dark-border">
                        <code className="text-body-sm text-apple-blue-400 break-all">
                          {embedUrl}
                        </code>
                      </div>
                    </div>

                    {/* Embed Code */}
                    <div>
                      <label className="block text-body-sm font-medium text-apple-gray-300 mb-2">
                        Embed Code
                      </label>
                      <textarea
                        readOnly
                        value={embedCode}
                        className="w-full p-4 rounded-apple bg-apple-dark-surface text-apple-gray-50 border border-apple-dark-border focus:outline-none font-mono text-body-sm resize-none"
                        rows={4}
                      />
                    </div>

                    {/* Info Box */}
                    <div className="p-4 bg-apple-blue-900/20 border border-apple-blue-800/30 rounded-apple">
                      <p className="text-apple-blue-300 text-body-sm mb-2 font-semibold">
                        💡 Tips
                      </p>
                      <ul className="text-apple-blue-200 text-caption space-y-1">
                        <li>
                          • Only selected testimonials (from "Select for Embed"
                          tab) will be shown
                        </li>
                        <li>
                          • Adjust the height attribute in the code to fit your
                          content
                        </li>
                        <li>
                          • Remove height for auto-sizing (works best with grid
                          templates)
                        </li>
                      </ul>
                    </div>

                    {/* Copy Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => copyToClipboard(embedCode)}
                      className="btn-apple-primary w-full py-4 text-body-sm"
                    >
                      {copied ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied!
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy Embed Code
                        </span>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacePage;
