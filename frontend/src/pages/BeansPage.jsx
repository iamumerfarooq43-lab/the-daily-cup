import { useRef } from "react";
import { motion } from "framer-motion";
import BeanCard from "../components/BeanCard";
import { coffeeBeans } from "../data/Beans.js";

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

const cardStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const BeansPage = () => {
  const scrollContainer = useRef(null);

  const scrollLeft = () =>
    scrollContainer.current.scrollBy({ left: -340, behavior: "smooth" });
  const scrollRight = () =>
    scrollContainer.current.scrollBy({ left: 340, behavior: "smooth" });

  return (
    <section className="w-full bg-fav5 py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* ── Section Header — stagger children ── */}
        <motion.div
          className="flex items-end justify-between mb-14"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left text */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-fav2 border border-fav2 px-4 py-1.5 rounded-full mb-4">
              Our Selection
            </span>
            <h2 className="text-5xl font-bold text-fav3 leading-tight">
              Fresh &{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-fav2">Finest Beans</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-fav1 opacity-40 rounded-sm -z-0" />
              </span>
            </h2>
            <p className="text-fav7 mt-4 text-base">
              Handpicked from the finest farms around the world
            </p>
          </motion.div>

          {/* Scroll Buttons — fade in from right */}
          <motion.div
            className="hidden md:flex items-center gap-3 mb-2"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <button
              onClick={scrollLeft}
              className="w-11 h-11 rounded-full border border-fav6 text-fav3
                         hover:bg-fav1 hover:border-fav1 transition-all duration-300
                         flex items-center justify-center text-lg"
            >
              ❮
            </button>
            <button
              onClick={scrollRight}
              className="w-11 h-11 rounded-full border border-fav6 text-fav3
                         hover:bg-fav1 hover:border-fav1 transition-all duration-300
                         flex items-center justify-center text-lg"
            >
              ❯
            </button>
          </motion.div>
        </motion.div>

        {/* ── Carousel — cards stagger in ── */}
        <div className="relative">
          <motion.div
            ref={scrollContainer}
            className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            variants={cardStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {coffeeBeans.map((bean) => (
              <motion.div
                key={bean.id}
                className="flex-shrink-0 w-72"
                variants={cardFadeUp}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <BeanCard bean={bean} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Mobile Scroll Buttons ── */}
        <motion.div
          className="flex md:hidden items-center justify-center gap-4 mt-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <button
            onClick={scrollLeft}
            className="w-11 h-11 rounded-full border border-fav6 text-fav3
                       hover:bg-fav1 hover:border-fav1 transition-all duration-300
                       flex items-center justify-center text-lg"
          >
            ❮
          </button>
          <button
            onClick={scrollRight}
            className="w-11 h-11 rounded-full border border-fav6 text-fav3
                       hover:bg-fav1 hover:border-fav1 transition-all duration-300
                       flex items-center justify-center text-lg"
          >
            ❯
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default BeansPage;
