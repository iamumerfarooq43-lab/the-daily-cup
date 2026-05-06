import { useRef } from "react";
import { motion } from "framer-motion";
import ReviewCard from "../components/ReviewCard";
import { reviews } from "../data/Reviews";

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
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const cardFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const FeedbackPage = () => {
  const scrollContainer = useRef(null);

  const scrollLeft = () =>
    scrollContainer.current.scrollBy({ left: -310, behavior: "smooth" });
  const scrollRight = () =>
    scrollContainer.current.scrollBy({ left: 310, behavior: "smooth" });

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <section className="w-full bg-stone-100 py-24 px-4 overflow-hidden">
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
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-fav1 border border-fav1 px-4 py-1.5 rounded-full mb-4">
              Customer Reviews
            </span>
            <h2 className="text-5xl font-bold text-fav5 leading-tight">
              What People{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-fav1">Are Saying</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-fav2 opacity-40 rounded-sm -z-0" />
              </span>
            </h2>

            {/* Average rating */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-bold text-fav4">{avgRating}</span>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${i < Math.round(avgRating) ? "text-fav2" : "text-fav7"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-xs text-fav6 mt-0.5">
                  Based on {reviews.length} reviews
                </p>
              </div>
            </div>
          </motion.div>

          {/* Scroll Buttons */}
          <motion.div
            className="hidden md:flex items-center gap-3 mb-2"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <button
              onClick={scrollLeft}
              className="w-11 h-11 rounded-full border border-fav4 text-fav4
                         hover:bg-fav1 hover:border-fav1 hover:text-white
                         transition-all duration-300 flex items-center justify-center text-lg"
            >
              ❮
            </button>
            <button
              onClick={scrollRight}
              className="w-11 h-11 rounded-full border border-fav4 text-fav4
                         hover:bg-fav1 hover:border-fav1 hover:text-white
                         transition-all duration-300 flex items-center justify-center text-lg"
            >
              ❯
            </button>
          </motion.div>
        </motion.div>

        {/* ── Carousel — cards stagger in ── */}
        <motion.div
          ref={scrollContainer}
          className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          variants={cardStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={cardFadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </motion.div>

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
            className="w-11 h-11 rounded-full border border-fav4 text-fav4
                       hover:bg-fav1 hover:border-fav1 hover:text-white
                       transition-all duration-300 flex items-center justify-center text-lg"
          >
            ❮
          </button>
          <button
            onClick={scrollRight}
            className="w-11 h-11 rounded-full border border-fav4 text-fav4
                       hover:bg-fav1 hover:border-fav1 hover:text-white
                       transition-all duration-300 flex items-center justify-center text-lg"
          >
            ❯
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeedbackPage;
