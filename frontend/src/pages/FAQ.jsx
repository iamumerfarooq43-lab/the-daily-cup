import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const faqs = [
  {
    question: "What are your opening hours?",
    answer:
      "We're open every day from 7:00 AM to 10:00 PM. Orders placed before 9:30 PM will be accepted for same-day delivery.",
  },
  {
    question: "Do you deliver across Lahore?",
    answer:
      "Yes! We currently deliver across all major areas of Lahore including DHA, Gulberg, Johar Town, Model Town, and Bahria Town. Enter your address at checkout to confirm coverage.",
  },
  {
    question: "How do payments work?",
    answer:
      "We accept Credit Card, Debit Card, Easypaisa, JazzCash, and Cash on Delivery. All online payments are processed securely through our checkout.",
  },
  {
    question: "Can I customize drinks (milk, sugar, decaf)?",
    answer:
      "Absolutely! Use the special instructions field at checkout to mention your preferences — oat milk, less sugar, extra shot, decaf, and more.",
  },
  {
    question: "Do I need an account to order?",
    answer:
      "Yes, a free account is required to place orders so we can track your delivery and keep your order history. Signing up takes less than a minute!",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    // ✅ Matches FeedbackPage exactly
    <section id="faq" className="w-full bg-fav7 py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* ── Section Header — same flex justify-between as FeedbackPage ── */}
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
              Questions & Answers
            </span>
            <h2 className="text-5xl font-bold text-fav5 leading-tight">
              Common{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-fav1">Questions</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-fav2 opacity-40 rounded-sm -z-0" />
              </span>
            </h2>
            <p className="text-fav6 mt-4 text-base">
              Quick answers about ordering, delivery, and your experience with
              us.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Accordion ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-full"
        >
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`rounded-2xl overflow-hidden transition-all duration-200
                    ${
                      isOpen
                        ? "bg-white border border-fav3 shadow-sm"
                        : "bg-white border border-fav3/50 hover:border-fav3 hover:shadow-sm"
                    }`}
                >
                  <button
                    onClick={() => setActiveIndex(isOpen ? null : index)}
                    className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none"
                  >
                    <span
                      className={`text-sm font-semibold transition-colors duration-200
                      ${isOpen ? "text-fav1" : "text-fav5"}`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 ml-6 transition-all duration-200
                      ${
                        isOpen
                          ? "bg-fav1 border-fav1 text-white"
                          : "bg-fav3/30 border-fav3 text-fav5"
                      }`}
                    >
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 text-sm text-fav6 leading-relaxed border-t border-fav3/50 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
