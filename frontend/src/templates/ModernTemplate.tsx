import { TemplateProps } from "./index";

const ModernTemplate = ({ testimonials }: TemplateProps) => {
  return (
    <div className="p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300"
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
              <div className="text-gray-200 text-base">
                {testimonial.content}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-300 text-lg">No testimonials available.</div>
      )}
    </div>
  );
};

export default ModernTemplate;

