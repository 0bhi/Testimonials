import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Testimonial {
  id: number;
  name: string;
  email: string;
  content: string;
  image: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EmbedTestimonials = () => {
  const { spaceName } = useParams<{ spaceName: string }>();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

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
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-white">
      {testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
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
                  <div className="text-gray-900 text-lg font-semibold">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {testimonial.email}
                  </div>
                </div>
              </div>
              <div className="text-gray-800 text-base">
                {testimonial.content}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-800 text-lg">No testimonials available.</div>
      )}
    </div>
  );
};

export default EmbedTestimonials;
