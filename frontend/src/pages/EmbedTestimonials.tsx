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

  // Get URL parameters for customization
  const limit = parseInt(searchParams.get("limit") || "0", 10); // 0 means show all
  const page = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const response = await api.getPublicSpace(spaceName!);
        const data = await response.json();
        let allTestimonials = data.testimonials || [];

        // Apply pagination if limit is specified
        if (limit > 0) {
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          allTestimonials = allTestimonials.slice(startIndex, endIndex);
        }

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
  }, [spaceName, limit, page]);

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
