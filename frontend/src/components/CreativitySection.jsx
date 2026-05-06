import { motion } from "framer-motion";
import coffeeCupVideo from "../assets/Video/CoffeeCup.mp4";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const CreativitySection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-fav3 py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* ── Left Section — stagger children ── */}
          <motion.div
            className="space-y-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Tag */}
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="inline-block text-xs font-semibold tracking-widest uppercase text-fav1 border border-fav1 px-4 py-1.5 rounded-full"
            >
              Our Philosophy
            </motion.span>

            {/* Heading */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-3"
            >
              <h2 className="text-5xl font-bold text-fav5 leading-tight">
                What{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-fav1">Creativity</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-fav2 opacity-40 rounded-sm -z-0" />
                </span>
                <br />
                Means to Us
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-fav4 text-lg leading-relaxed font-playwrite"
            >
              Creativity is the heart of everything we do. From sourcing the
              finest beans to crafting the perfect cup — every detail is an
              expression of our passion.
            </motion.p>

            {/* Divider */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-16 h-0.5 bg-fav1 rounded-full"
            />

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex items-center gap-8"
            >
              {[
                { num: "12+", label: "Bean Origins" },
                { num: "8", label: "Roast Profiles" },
                { num: "100%", label: "Handcrafted" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-fav4">{stat.num}</p>
                  <p className="text-xs text-fav6 tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Bottom row */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-md border-2 border-fav2 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=200&h=200&fit=crop"
                  alt="Coffee creativity"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => navigate("/Health")}
                className="group flex items-center gap-2 bg-fav4 hover:bg-fav5 text-fav3 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                View Story
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </button>
            </motion.div>
          </motion.div>

          {/* ── Right Section — fades in from right ── */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          >
            {/* Decorative ring */}
            <div className="absolute -top-6 -right-6 w-full h-full border-2 border-fav2 rounded-2xl opacity-40" />

            {/* Video */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <video
                src={coffeeCupVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-fav5/60 to-transparent" />
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-5 left-6 bg-white border border-fav2 px-5 py-3 shadow-xl rounded-2xl flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
            >
              <span className="text-2xl">☕</span>
              <div>
                <p className="text-xs font-bold text-fav4 tracking-wide uppercase">
                  Creaminess
                </p>
                <p className="text-xs text-fav6">Crafted with love 💗</p>
              </div>
            </motion.div>

            {/* Small floating tag */}
            <motion.div
              className="absolute -top-4 left-6 bg-fav1 text-fav3 text-xs font-semibold px-4 py-1.5 rounded-full shadow-md"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
            >
              ✦ Artisan Roasted
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CreativitySection;
