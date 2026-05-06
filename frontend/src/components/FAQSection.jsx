import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "What are your opening hours?",
    a: "We serve from 7:00 AM to 11:00 PM every day. Holiday hours are posted on our story page and social channels.",
  },
  {
    q: "Do you deliver across Lahore?",
    a: "Yes. Most areas in Lahore are covered within about 25–40 minutes. At checkout, allow location access so we can pin your drop-off on the map for the rider.",
  },
  {
    q: "How do payments work?",
    a: "You can pay by card, digital wallet, or cash on delivery. Promo codes can be applied before you place your order on the checkout screen.",
  },
  {
    q: "Can I customize drinks (milk, sugar, decaf)?",
    a: "Absolutely. Add your preferences in delivery instructions and we'll pass them to the barista. For allergens, mention them there too.",
  },
  {
    q: "Do I need an account to order?",
    a: "You can browse the menu as a guest, but creating an account lets you track orders, save your details, and check out faster next time.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    // ── Section entrance — fades + slides up when scrolled into view
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-16 rounded-3xl border border-fav3/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8"
    >
      {/* Header — staggers in after the container */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-xs font-semibold uppercase tracking-[0.2em] text-fav1"
      >
        FAQ
      </motion.p>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-2 text-2xl font-bold text-fav5 sm:text-3xl"
      >
        Common questions
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-2 max-w-2xl text-sm text-fav6"
      >
        Quick answers about ordering, delivery, and your experience with us.
      </motion.p>

      {/* FAQ list — each item staggers in */}
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              // each child fires 0.08s after the previous one
              staggerChildren: 0.08,
              delayChildren: 0.35,
            },
          },
        }}
        className="mt-8 space-y-3"
      >
        {faqs.map((item, index) => {
          const open = openIndex === index;
          return (
            <motion.li
              key={item.q}
              variants={{
                hidden:  { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
              }}
              className="overflow-hidden rounded-2xl border border-fav3/70
                         bg-fav4/20 transition-shadow duration-300 hover:shadow-md"
            >
              {/* Question button */}
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4
                           text-left transition-colors hover:bg-fav3/40"
                aria-expanded={open}
              >
                <span className="text-sm font-semibold text-fav5 sm:text-base">
                  {item.q}
                </span>

                {/* + icon rotates to × when open */}
                <motion.span
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center
                               rounded-full border bg-white text-lg font-light
                               transition-colors duration-200
                               ${open
                                 ? "border-fav1 text-fav1"
                                 : "border-fav4/40 text-fav5"}`}
                  aria-hidden
                >
                  +
                </motion.span>
              </button>

              {/* Answer — AnimatePresence handles mount/unmount animation */}
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden border-t border-fav3/50 bg-white/90"
                  >
                    <p className="px-5 py-4 text-sm leading-relaxed text-fav6">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </motion.ul>
    </motion.div>
  );
}