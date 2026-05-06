import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import heroBg from "../assets/hero-bg.webp";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

// ── Count-up hook ──────────────────────────────
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(parseFloat(current.toFixed(1)));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

// ── Stat item with count-up ────────────────────
function StatItem({ num, suffix, label }) {
  const count = useCountUp(num);
  return (
    <div>
      <p className="text-3xl font-bold text-fav2">
        {count}
        {suffix}
      </p>
      <p className="text-xs text-fav6 mt-1 tracking-wide">{label}</p>
    </div>
  );
}

// ── Updated stats data ─────────────────────────
const stats = [
  { num: 2400, suffix: "+", label: "Happy Customers" },
  { num: 15, suffix: " min", label: "Avg. Delivery" },
  { num: 4.9, suffix: " / 5", label: "App Rating" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

function HeroSection() {
  const navigate = useNavigate();

  function scrollToMenu() {
    document
      .getElementById("menu-section")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="relative w-full min-h-screen bg-fav5 overflow-hidden">
      <Navbar />

      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #a47251, transparent 70%)",
        }}
      />

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col justify-center min-h-screen pt-32 pb-16"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-2xl space-y-8">
          <motion.div
            className="flex items-center gap-3"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="w-8 h-px bg-fav2" />
            <span className="text-xs font-semibold tracking-widest uppercase text-fav2">
              Premium Coffee Experience
            </span>
          </motion.div>

          <motion.h1
            className="text-7xl font-bold text-fav3 leading-none"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Where Every
            <br />
            <span className="text-fav2">Sip Tells</span>
            <br />a Story
          </motion.h1>

          <motion.p
            className="text-fav7 text-lg leading-relaxed max-w-md border-l-2 border-fav1 pl-4"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Artisan coffee, premium teas, fresh food — order in seconds, enjoy
            in minutes.
          </motion.p>

          <motion.div
            className="flex items-center gap-4"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <button
              onClick={scrollToMenu}
              className="group bg-fav2 hover:bg-fav1 text-fav5 px-10 py-4 rounded-full
                         text-sm font-bold transition-all duration-300
                         flex items-center gap-2 shadow-lg"
            >
              Order Now
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </button>
            <button
              onClick={() => navigate("/Health")}
              className="text-fav7 hover:text-fav2 text-sm font-semibold
                         transition-colors duration-300 flex items-center gap-2 group"
            >
              Watch Story
              <span
                className="w-8 h-8 rounded-full border border-fav6 group-hover:border-fav2
                               flex items-center justify-center transition-colors duration-300"
              >
                ▶
              </span>
            </button>
          </motion.div>

          {/* ── Stats with count-up ── */}
          <motion.div
            className="flex items-center gap-12 pt-8 border-t border-fav4"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {stats.map((stat) => (
              <StatItem key={stat.label} {...stat} />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default HeroSection;
