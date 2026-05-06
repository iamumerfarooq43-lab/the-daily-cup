import { motion } from "framer-motion";
import ContactForm from "../components/ContactForm";
import ContactInfo from "../components/ContactInfo";

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

const ContactPage = () => {
  return (
    <section id="contact" className="w-full bg-stone-100 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ── Section Header ── */}
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
            Get In Touch
          </motion.span>

          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-5xl font-bold text-fav5 leading-tight"
          >
            We're Here{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-fav1">to Help</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-fav2 opacity-40 rounded-sm -z-0" />
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-fav6 mt-4 text-base"
          >
            Have questions? Our care team is available anytime.
          </motion.p>
        </motion.div>

        {/* ── Two Column Layout ── */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Form — fades up */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <ContactForm />
          </motion.div>

          {/* Info — fades up with slight delay */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <ContactInfo />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactPage;
