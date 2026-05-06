import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { getProducts } from "../api/products";

const categoryInfo = {
  Coffee: {
    title: "Coffee & Espresso",
    sub: "Handcrafted espresso drinks, made fresh to order",
  },
  Tea: {
    title: "Teas & Herbal Drinks",
    sub: "Premium loose-leaf teas and herbal blends",
  },
  Sandwich: {
    title: "Sandwiches & Wraps",
    sub: "Fresh ingredients, made to order",
  },
  Salad: {
    title: "Fresh Salads",
    sub: "Crisp greens and seasonal ingredients",
  },
  Sweets: { title: "Sweet Treats", sub: "Delicious desserts and sweet bites" },
};

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
      delayChildren: 0.1,
    },
  },
};

const cardFadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("Coffee");
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        const unique = [...new Set(data.map((p) => p.category))].map(
          (name) => ({
            name,
            icon: categoryInfo[name]?.icon ?? "☕",
          }),
        );
        setCategories(unique);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetch();
  }, []);

  const filteredProducts = useMemo(
    () => products.filter((p) => p.category === activeCategory),
    [activeCategory, products],
  );

  const { title, sub } = categoryInfo[activeCategory] || {
    title: activeCategory,
    sub: "",
  };

  return (
    <section className="bg-stone-100 py-16">
      {/* ── Section heading ── */}
      <motion.div
        className="text-center mb-10"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-medium text-stone-800 mb-2">Our Menu</h2>
        <p className="text-sm text-stone-500">
          Fresh ingredients, handcrafted with care
        </p>
      </motion.div>

      {/* ── Main layout — stacks on mobile, row on desktop ── */}
      <motion.div
        className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-8"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* ── Sidebar — full width on mobile, fixed on desktop ── */}
        <motion.aside
          className="w-full lg:w-52 flex-shrink-0"
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <button
            onClick={() => navigate("/products")}
            className="w-full flex items-center gap-3 p-3 mb-4 border border-stone-200
                       rounded-xl bg-white hover:border-amber-700 hover:bg-amber-50
                       transition-all text-left"
          >
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-lg">
              ☕
            </div>
            <span className="text-sm font-medium text-stone-800">
              View Full Menu
            </span>
          </button>

          {/* ── Category buttons — horizontal scroll on mobile ── */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-x-auto lg:overflow-hidden">
            <div className="flex lg:flex-col">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex-shrink-0 flex items-center gap-3 px-4 py-5 border-b lg:border-b-0 lg:border-l-2 transition-all text-left
                    ${
                      activeCategory === cat.name
                        ? "lg:border-l-amber-700 bg-amber-50"
                        : "lg:border-l-transparent hover:bg-stone-50"
                    }`}
                >
                  <div className="w-7 h-7 bg-amber-50 rounded-md flex items-center justify-center text-sm">
                    {cat.icon}
                  </div>
                  <span
                    className={`text-sm transition-colors
                    ${activeCategory === cat.name ? "text-amber-800 font-medium" : "text-stone-600"}`}
                  >
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* ── Right Content ── */}
        <motion.div
          className="flex-1"
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* ── Category title ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + "-title"}
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h3 className="text-xl font-medium text-stone-800 mb-1">
                {title}
              </h3>
              <p className="text-sm text-stone-500">{sub}</p>
            </motion.div>
          </AnimatePresence>

          {/* ── Product grid — 2 cols mobile, 3 tablet, 4 desktop ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={cardStagger}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {filteredProducts.map((product) => (
                <motion.button
                  key={product._id}
                  variants={cardFadeUp}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  onClick={() => navigate(`/item/${product._id}`)}
                  className="bg-white border border-stone-200 rounded-xl overflow-hidden
                             text-center hover:border-amber-600 hover:shadow-sm
                             transition-all group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-30 object-cover group-hover:scale-105
                               transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="p-3">
                    <p className="text-sm font-medium text-stone-800">
                      {product.name}
                    </p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default MenuSection;
