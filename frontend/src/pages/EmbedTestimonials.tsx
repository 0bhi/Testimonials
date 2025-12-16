import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import { getTemplate, Testimonial } from "../templates";

const EmbedTestimonials = () => {
  const { spaceName } = useParams<{ spaceName: string }>();
  const [searchParams] = useSearchParams();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [templateId, setTemplateId] = useState<string>("modern");

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const response = await api.getPublicSpace(spaceName!);
        const data = await response.json();
        setTestimonials(data.testimonials || []);

        // Get template from URL parameter or space data, default to "modern"
        const urlTemplate = searchParams.get("template");
        const spaceTemplate = data.template || "modern";
        setTemplateId(urlTemplate || spaceTemplate);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching space:", error);
        setLoading(false);
      }
    };
    fetchSpace();
  }, [spaceName, searchParams]);

  if (loading) {
    return (
      <div className="min-h-[300px] bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const template = getTemplate(templateId);
  const TemplateComponent = template.component;

  return <TemplateComponent testimonials={testimonials} />;
};

export default EmbedTestimonials;
