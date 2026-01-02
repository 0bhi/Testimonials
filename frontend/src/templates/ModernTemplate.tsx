import { motion } from "framer-motion";
import { Testimonial } from "./index";

interface ModernTemplateProps {
  testimonials: Testimonial[];
}

const ModernTemplate = ({ testimonials }: ModernTemplateProps) => {
  if (testimonials.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8 min-h-[200px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-slate-600 text-lg">No testimonials yet</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                {testimonial.image ? (
                  <motion.img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mr-4 ring-2 ring-blue-100"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  />
                ) : (
                  <motion.div
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mr-4 flex items-center justify-center text-white font-bold text-lg"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {testimonial.name.charAt(0).toUpperCase()}
                  </motion.div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {testimonial.name}
                  </h3>
                </div>
              </div>
              <motion.p
                className="text-slate-700 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                "{testimonial.content}"
              </motion.p>
              <div className="mt-6 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 + i * 0.1 }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
