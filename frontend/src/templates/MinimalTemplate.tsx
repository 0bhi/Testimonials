import { motion } from "framer-motion";
import { Testimonial } from "./index";

interface MinimalTemplateProps {
  testimonials: Testimonial[];
}

const MinimalTemplate = ({ testimonials }: MinimalTemplateProps) => {
  if (testimonials.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-8 min-h-[200px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-slate-500 text-lg">No testimonials yet</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-light text-slate-900 tracking-tight mb-3">
            Testimonials
          </h2>
          <motion.div
            className="w-16 h-0.5 bg-slate-300 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="text-center h-full"
            >
              <motion.div
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 h-full flex flex-col"
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <motion.p
                  className="text-base md:text-lg text-slate-700 leading-relaxed mb-6 font-light flex-grow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  "{testimonial.content}"
                </motion.p>
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  {testimonial.image ? (
                    <motion.img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mb-3 ring-2 ring-slate-200"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    />
                  ) : (
                    <motion.div
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 mb-3 flex items-center justify-center text-white font-semibold text-base ring-2 ring-slate-200"
                      whileHover={{ scale: 1.15, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {testimonial.name.charAt(0).toUpperCase()}
                    </motion.div>
                  )}
                  <p className="text-sm font-medium text-slate-900">
                    {testimonial.name}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinimalTemplate;
