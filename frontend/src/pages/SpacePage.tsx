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

const SpacePage = () => {
  const { spaceName } = useParams<{ spaceName: string }>();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/space/${spaceName}`
        );
        const { data } = response;
        console.log("Fetched space:", data);
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

  const embedCode = `<iframe src="http://localhost:5173/embed/testimonials/${spaceName}" width="100%" height="600" frameborder="0" style="border:0; overflow:hidden;" allowfullscreen></iframe>`;

  return (
    <div className="w-full bg-slate-900 h-screen p-8">
      <div className="text-white text-4xl font-semibold border-b border-gray-800 pb-4 mb-8">
        Testimonials for {spaceName}
      </div>
      {testimonials.length > 0 ? (
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
              <div className="text-white text-base">{testimonial.content}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-white text-lg">No testimonials available.</div>
      )}
      <div className="mt-8">
        <h3 className="text-white text-2xl font-semibold mb-4">Embed Code</h3>
        <textarea
          readOnly
          value={embedCode}
          className="w-full p-4 rounded bg-gray-800 text-white focus:outline-none"
          rows={4}
        />
      </div>
    </div>
  );
};

export default SpacePage;
