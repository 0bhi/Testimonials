import { TemplateProps } from "./index";

const CardTemplate = ({ testimonials }: TemplateProps) => {
  const colors = [
    "bg-blue-50 border-blue-200",
    "bg-purple-50 border-purple-200",
    "bg-pink-50 border-pink-200",
    "bg-green-50 border-green-200",
    "bg-yellow-50 border-yellow-200",
    "bg-indigo-50 border-indigo-200",
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
      {testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => {
            const colorClass = colors[index % colors.length];
            return (
              <div
                key={testimonial.id}
                className={`${colorClass} border-2 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex items-center mb-4">
                  {testimonial.image && (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full mr-4 ring-2 ring-white"
                    />
                  )}
                  <div>
                    <div className="text-gray-900 text-lg font-bold">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {testimonial.email}
                    </div>
                  </div>
                </div>
                <div className="text-gray-800 text-base leading-relaxed">
                  {testimonial.content}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-600 text-lg text-center py-12">
          No testimonials available.
        </div>
      )}
    </div>
  );
};

export default CardTemplate;

