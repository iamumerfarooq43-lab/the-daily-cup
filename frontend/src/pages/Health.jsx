import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HealthBenefits from "../components/HealthBenefits";
import NutritionInfo from "../components/NutritionInfo";
import coffeeStoryVideo from "../assets/Video/CoffeeStory.mp4";

// ── Animation variants ──
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
      delayChildren: 0.1,
    },
  },
};

const cardFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const safeTips = [
  {
    icon: "⏰",
    title: "Best Time to Drink",
    tip: "10am–12pm or 2pm–5pm — avoid drinking right after waking or late at night.",
  },
  {
    icon: "💧",
    title: "Stay Hydrated",
    tip: "Drink a glass of water with every cup of coffee to stay properly hydrated.",
  },
  {
    icon: "🚫",
    title: "Avoid on Empty Stomach",
    tip: "Coffee on an empty stomach increases acid production. Have a light snack first.",
  },
  {
    icon: "😴",
    title: "Cut Off Time",
    tip: "Stop drinking coffee 6 hours before bedtime to avoid disrupting your sleep.",
  },
  {
    icon: "🤰",
    title: "Pregnancy Caution",
    tip: "Limit to 200mg caffeine per day during pregnancy. Consult your doctor.",
  },
  {
    icon: "💊",
    title: "Medication Interactions",
    tip: "Coffee can interfere with certain medications. Check with your pharmacist.",
  },
];

const originFacts = [
  { num: "850 AD", label: "First Discovery" },
  { num: "Ethiopia", label: "Country of Origin" },
  { num: "15th C", label: "First Cultivation" },
  { num: "70+", label: "Countries Grow It" },
];

const timeline = [
  { year: "850 AD", event: "Kaldi discovers coffee in Ethiopia", icon: "🌱" },
  {
    year: "1000 AD",
    event: "Avicenna describes coffee in medical writings",
    icon: "📜",
  },
  { year: "1400s", event: "First coffee cultivation in Yemen", icon: "🌍" },
  {
    year: "1500s",
    event: "Coffeehouses open across the Middle East",
    icon: "🏛️",
  },
  { year: "1600s", event: "Coffee reaches Europe and America", icon: "⛵" },
  {
    year: "Today",
    event: "2.25 billion cups consumed daily worldwide",
    icon: "☕",
  },
];

function Health() {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  const handlePlayVideo = () => {
    setShowVideo(true);
    if (videoRef.current) videoRef.current.play();
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
    if (videoRef.current) videoRef.current.pause();
  };

  return (
    <div className="min-h-screen bg-fav3 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero Section ── */}
        <section className="bg-fav5 pt-32 pb-24 px-4 relative overflow-hidden">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-24 left-6 md:left-16 flex items-center gap-2
                       text-fav7 hover:text-fav2 text-sm font-semibold transition-colors duration-300"
          >
            ← Back
          </button>

          {/* Radial glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
            style={{
              background: "radial-gradient(circle, #a47251, transparent 70%)",
            }}
          />

          {/* Hero content — stagger on load ── */}
          <motion.div
            className="max-w-6xl mx-auto text-center relative z-10"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="inline-block text-xs font-semibold tracking-widest uppercase text-fav2 border border-fav2 px-4 py-1.5 rounded-full mb-6"
            >
              Coffee & Wellness
            </motion.span>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-6xl font-bold text-fav3 leading-tight mb-6"
            >
              Coffee &{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-fav2">Your Health</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-fav1 opacity-40 rounded-sm -z-0" />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-fav7 text-lg max-w-xl mx-auto leading-relaxed"
            >
              Discover the science behind coffee and how to make it work best
              for your body and lifestyle.
            </motion.p>

            {/* Quick stats — stagger each stat ── */}
            <motion.div
              className="flex items-center justify-center gap-8 mt-12"
              variants={cardStagger}
              initial="hidden"
              animate="visible"
            >
              {[
                { num: "400mg", label: "Safe daily caffeine" },
                { num: "3–5", label: "Optimal cups per day" },
                { num: "6hrs", label: "Before-sleep cutoff" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  variants={cardFadeUp}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <p className="text-2xl font-bold text-fav2">{stat.num}</p>
                  <p className="text-xs text-fav7 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── Origin Story Section ── */}
        <section className="bg-stone-100 py-24 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <motion.div
              className="mb-14"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.span
                variants={fadeUp}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="inline-block text-xs font-semibold tracking-widest uppercase text-fav1 border border-fav1 px-4 py-1.5 rounded-full mb-4"
              >
                The Origin
              </motion.span>
              <motion.h2
                variants={fadeUp}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-5xl font-bold text-fav5 leading-tight"
              >
                How Coffee{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-fav1">
                    Changed the World
                  </span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-fav2 opacity-40 rounded-sm -z-0" />
                </span>
              </motion.h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* ── Left: Story Text — stagger ── */}
              <motion.div
                className="space-y-8"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {/* Fact pills */}
                <motion.div
                  className="flex flex-wrap gap-3"
                  variants={fadeUp}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  {originFacts.map((fact) => (
                    <div
                      key={fact.label}
                      className="bg-white border border-fav3/80 rounded-2xl px-4 py-2.5 shadow-sm"
                    >
                      <p className="text-sm font-bold text-fav1">{fact.num}</p>
                      <p className="text-xs text-fav6">{fact.label}</p>
                    </div>
                  ))}
                </motion.div>

                {/* Paragraph 1 */}
                <motion.div
                  className="space-y-2"
                  variants={fadeUp}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-fav1 flex items-center justify-center text-fav3 text-sm">
                      🌱
                    </div>
                    <h3 className="text-lg font-bold text-fav5">
                      The Legend of Kaldi
                    </h3>
                  </div>
                  <p className="text-fav6 leading-relaxed text-sm border-l-2 border-fav1 pl-4">
                    The story of coffee begins around{" "}
                    <strong className="text-fav4">850 AD</strong> in the
                    highland forests of{" "}
                    <strong className="text-fav4">Kaffa, Ethiopia</strong>.
                    Legend has it that a goat herder named{" "}
                    <strong className="text-fav4">Kaldi</strong> noticed his
                    goats dancing with unusual energy after eating bright red
                    berries from a certain tree. Curious, he brought the berries
                    to a local monastery, where monks made a drink from them and
                    discovered they could stay awake through long evening
                    prayers. Word of this energizing brew spread east, and
                    coffee began its extraordinary journey across the world.
                  </p>
                </motion.div>

                {/* Paragraph 2 */}
                <motion.div
                  className="space-y-2"
                  variants={fadeUp}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-fav1 flex items-center justify-center text-fav3 text-sm">
                      🌍
                    </div>
                    <h3 className="text-lg font-bold text-fav5">
                      From Yemen to the World
                    </h3>
                  </div>
                  <p className="text-fav6 leading-relaxed text-sm border-l-2 border-fav1 pl-4">
                    By the <strong className="text-fav4">15th century</strong>,
                    coffee was being cultivated and traded in{" "}
                    <strong className="text-fav4">Yemen</strong>, where Sufi
                    monks used it to fuel midnight devotions. The port city of{" "}
                    <strong className="text-fav4">Mocha</strong> became the
                    world's first coffee trading hub — a name that lives on in
                    your favorite chocolate coffee drink today. By the 17th
                    century, coffeehouses known as{" "}
                    <strong className="text-fav4">"Schools of the Wise"</strong>{" "}
                    had spread across Europe, becoming centres of intellectual
                    debate, business, and culture. Today, over{" "}
                    <strong className="text-fav4">2.25 billion cups</strong> are
                    consumed every single day — making coffee the world's second
                    most traded commodity after oil.
                  </p>
                </motion.div>

                {/* Quote */}
                <motion.div
                  className="bg-fav5 rounded-3xl p-6 relative overflow-hidden"
                  variants={fadeUp}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
                    style={{
                      background:
                        "radial-gradient(circle, #d79a59, transparent)",
                    }}
                  />
                  <span className="text-4xl text-fav2 font-serif leading-none block mb-2">
                    "
                  </span>
                  <p className="text-fav3 text-sm leading-relaxed italic">
                    Coffee is the common man's gold, and like gold, it brings to
                    every person the feeling of luxury and nobility.
                  </p>
                  <p className="text-fav7 text-xs mt-3 font-semibold">
                    — Shehabeddin, Arab Scholar, 1587
                  </p>
                </motion.div>
              </motion.div>

              {/* ── Right: Video + Timeline — fades in from right ── */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              >
                {/* Video */}
                <div className="relative rounded-3xl overflow-hidden shadow-xl bg-fav5 aspect-video flex items-center justify-center">
                  {showVideo ? (
                    <>
                      <video
                        ref={videoRef}
                        src={coffeeStoryVideo}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={handleCloseVideo}
                        className="absolute top-4 right-4 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold z-20"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div
                      className="relative w-full h-full flex items-center justify-center group cursor-pointer"
                      onClick={handlePlayVideo}
                    >
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background:
                            "radial-gradient(circle at 30% 50%, #d79a59, transparent 60%), radial-gradient(circle at 70% 50%, #a47251, transparent 60%)",
                        }}
                      />
                      <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-fav2 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                          <span className="text-fav5 text-2xl ml-1">▶</span>
                        </div>
                        <div className="text-center">
                          <p className="text-fav3 font-bold text-sm">
                            The Story of Coffee
                          </p>
                          <p className="text-fav7 text-xs mt-0.5">
                            Documentary · 4 min
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-4 left-4 bg-fav2/90 backdrop-blur-sm text-fav5 text-xs font-bold px-3 py-1.5 rounded-full">
                        ✦ Origin Story
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline — each item staggers in ── */}
                <motion.div
                  className="bg-white rounded-3xl p-6 shadow-sm space-y-4"
                  variants={cardStagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <p className="text-xs font-semibold tracking-widest uppercase text-fav6 mb-5">
                    Coffee Timeline
                  </p>
                  {timeline.map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-4"
                      variants={cardFadeUp}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-fav3 flex items-center justify-center text-sm">
                          {item.icon}
                        </div>
                        {i < 5 && <div className="w-0.5 h-4 bg-fav3/80" />}
                      </div>
                      <div className="pb-1">
                        <p className="text-xs font-bold text-fav1">
                          {item.year}
                        </p>
                        <p className="text-xs text-fav6 leading-relaxed mt-0.5">
                          {item.event}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <HealthBenefits />
        <NutritionInfo />

        {/* ── Safe Consumption Tips ── */}
        <section className="py-24 px-4 bg-fav3">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              className="mb-14"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.span
                variants={fadeUp}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="inline-block text-xs font-semibold tracking-widest uppercase text-fav1 border border-fav1 px-4 py-1.5 rounded-full mb-4"
              >
                Drink Smart
              </motion.span>
              <motion.h2
                variants={fadeUp}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-5xl font-bold text-fav5 leading-tight"
              >
                Safe{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-fav1">Consumption</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-fav2 opacity-40 rounded-sm -z-0" />
                </span>{" "}
                Tips
              </motion.h2>
              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-fav6 mt-4 text-base max-w-xl"
              >
                Getting the most out of your coffee while keeping your health in
                check.
              </motion.p>
            </motion.div>

            {/* Tips cards — stagger ── */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={cardStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {safeTips.map((tip, index) => (
                <motion.div
                  key={index}
                  variants={cardFadeUp}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="group bg-white rounded-3xl p-6 shadow-sm
                             hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-fav3 flex items-center justify-center text-2xl">
                      {tip.icon}
                    </div>
                    <span className="text-3xl font-bold text-fav3 group-hover:text-fav2 transition-colors duration-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-fav5 mb-2 group-hover:text-fav1 transition-colors duration-300">
                    {tip.title}
                  </h3>
                  <div className="w-8 h-0.5 bg-fav1 rounded-full mb-3" />
                  <p className="text-sm text-fav6 leading-relaxed">{tip.tip}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-fav5 text-fav3 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-fav2 mb-3">The Daily Cup</h3>
              <p className="text-sm text-fav7">
                Premium coffee delivered fresh to your door.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-fav3 mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-fav7">
                <li>
                  <a href="/" className="hover:text-fav2 transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/products" className="hover:text-fav2 transition">
                    Menu
                  </a>
                </li>
                <li>
                  <a href="/health" className="hover:text-fav2 transition">
                    Health
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-fav3 mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-fav7">
                <li>
                  <a href="#" className="hover:text-fav2 transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-fav2 transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-fav2 transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-fav3 mb-3">Contact</h4>
              <p className="text-sm text-fav7 mb-2">support@coffeeshop.com</p>
              <p className="text-sm text-fav7">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-fav4 pt-6">
            <p className="text-center text-sm text-fav7">
              © 2024 The Daily Cup. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Health;
