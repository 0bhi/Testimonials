import { motion } from "framer-motion";
import { Testimonial } from "./index";

interface GradientTemplateProps {
  testimonials: Testimonial[];
}

const gradients = [
  "from-pink-500 via-red-500 to-yellow-500",
  "from-purple-500 via-pink-500 to-red-500",
  "from-cyan-500 via-blue-500 to-purple-500",
  "from-green-500 via-emerald-500 to-teal-500",
  "from-orange-500 via-red-500 to-pink-500",
  "from-indigo-500 via-purple-500 to-pink-500",
];

const GradientTemplate = ({ testimonials }: GradientTemplateProps) => {
  if (testimonials.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center p-8 min-h-[200px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-white text-lg">No testimonials yet</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Customer Stories
          </h2>
          <motion.div
            className="w-32 h-1 bg-white/50 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => {
            const gradient = gradients[index % gradients.length];
            return (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 },
                }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-90 blur-xl rounded-3xl" />
                <div
                  className={`relative bg-gradient-to-br ${gradient} rounded-3xl p-8 shadow-2xl transform transition-transform duration-300`}
                >
                  <motion.div
                    className="flex items-center mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 + 0.3 }}
                  >
                    {testimonial.image ? (
                      <motion.img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover mr-4 ring-4 ring-white/30"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      />
                    ) : (
                      <motion.div
                        className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm mr-4 flex items-center justify-center text-white font-bold text-2xl ring-4 ring-white/30"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        {testimonial.name.charAt(0).toUpperCase()}
                      </motion.div>
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {testimonial.name}
                      </h3>
                    </div>
                  </motion.div>
                  <motion.p
                    className="text-white text-lg leading-relaxed mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.4 }}
                  >
                    "{testimonial.content}"
                  </motion.p>
                  <motion.div
                    className="flex text-yellow-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.5 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.svg
                        key={i}
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: index * 0.15 + 0.6 + i * 0.1,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GradientTemplate;
