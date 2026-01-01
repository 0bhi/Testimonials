import { motion } from "framer-motion";
import { Testimonial } from "./index";

interface ClassicTemplateProps {
  testimonials: Testimonial[];
}

const ClassicTemplate = ({ testimonials }: ClassicTemplateProps) => {
  if (testimonials.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 flex items-center justify-center p-8 min-h-[200px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-amber-800 text-lg">No testimonials yet</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-amber-900 mb-3 tracking-tight">
            Testimonials
          </h2>
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ delay: 0.3, duration: 0.8 }}
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
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative h-full"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border-l-4 border-amber-600 pl-6 pr-6 py-6 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <motion.div
                  className="absolute -left-2 top-6 w-4 h-4 bg-amber-600 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                />
                <motion.blockquote
                  className="text-base md:text-lg text-gray-800 font-serif italic mb-6 leading-relaxed relative flex-grow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <motion.span
                    className="text-amber-600 text-3xl absolute -left-4 -top-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                  >
                    "
                  </motion.span>
                  {testimonial.content}
                </motion.blockquote>
                <motion.div
                  className="flex items-center pt-4 border-t border-amber-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {testimonial.image ? (
                    <motion.img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-amber-200 shadow-md flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    />
                  ) : (
                    <motion.div
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 mr-3 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-amber-200 flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {testimonial.name.charAt(0).toUpperCase()}
                    </motion.div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-amber-900 truncate">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs text-amber-700 truncate">
                      {testimonial.email}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;
