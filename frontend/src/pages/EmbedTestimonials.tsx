import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { getTemplate, Testimonial } from "../templates";

const EmbedTestimonials = () => {
  const { spaceName } = useParams<{ spaceName: string }>();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [templateId, setTemplateId] = useState<string>("modern");

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const response = await api.getPublicSpace(spaceName!);
        const data = await response.json();
        const allTestimonials = data.testimonials || [];

        setTestimonials(allTestimonials);

        // Get template from space data, default to "modern"
        const spaceTemplate = data.template || "modern";
        setTemplateId(spaceTemplate);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching space:", error);
        setLoading(false);
      }
    };
    fetchSpace();
  }, [spaceName]);

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center bg-transparent">
        <div className="text-slate-600">Loading testimonials...</div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center bg-transparent">
        <div className="text-slate-500 text-center">
          <p className="text-lg mb-2">No testimonials yet</p>
          <p className="text-sm">Check back soon!</p>
        </div>
      </div>
    );
  }

  const template = getTemplate(templateId);
  const TemplateComponent = template.component;

  return <TemplateComponent testimonials={testimonials} />;
};

export default EmbedTestimonials;
