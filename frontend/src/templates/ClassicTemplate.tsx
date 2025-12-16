import { TemplateProps } from "./index";

const ClassicTemplate = ({ testimonials }: TemplateProps) => {
  return (
    <div className="p-6 bg-white min-h-screen">
      {testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-gray-300"
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
              <div className="text-gray-700 text-base leading-relaxed">
                {testimonial.content}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600 text-lg text-center py-12">
          No testimonials available.
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;

