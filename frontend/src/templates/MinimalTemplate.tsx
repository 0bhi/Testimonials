import { TemplateProps } from "./index";

const MinimalTemplate = ({ testimonials }: TemplateProps) => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {testimonials.length > 0 ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="border-l-4 border-gray-300 pl-6 py-4 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center mb-3">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                )}
                <div>
                  <div className="text-gray-900 font-medium">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 text-sm">
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
        <div className="text-gray-500 text-lg text-center py-12">
          No testimonials available.
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;

