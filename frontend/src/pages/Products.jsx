import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { getProducts } from "../api/products";



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
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

function Products() {
  const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);
const [fetchError, setFetchError] = useState("");
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
   
    const fetch = async () => {
        const data = await getProducts();
        setProducts(data);
    };
    fetch();
}, []);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);

      // extract unique categories from real data
      const uniqueCategories = [...new Set(data.map(p => p.category))].map(name => ({
        name,
        icon: "☕"
      }));
      setCategories(uniqueCategories);
    } catch (err) {
      setFetchError("Failed to load products. Please try again.");
    }
  };
  fetchProducts();
}, []);

  const allCategories = [{ name: "All", icon: "☕" }, ...categories];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, search, products]);

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    }, {});
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* ── Page Header — stagger children ── */}
          <motion.div
            className="flex items-end justify-between mb-12"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <button
                onClick={() => navigate(-1)}
                className="text-fav6 hover:text-fav1 text-sm flex items-center gap-2 mb-4 transition-colors font-medium"
              >
                ← Back
              </button>
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-fav1 border border-fav1 px-4 py-1.5 rounded-full mb-4">
                Full Menu
              </span>
              <h1 className="text-5xl font-bold text-fav5 leading-tight">
                Our{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-fav1">Collection</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-fav2 opacity-40 rounded-sm -z-0" />
                </span>
              </h1>
              <p className="text-fav6 mt-3 text-base">
                {filteredProducts.length} items available
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              className="hidden md:flex items-center gap-3 mb-2"
              variants={fadeUp}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white border border-fav3 rounded-full px-5 py-2.5 pr-10
                             text-sm text-fav5 placeholder:text-fav7 w-56
                             focus:outline-none focus:ring-2 focus:ring-fav1
                             focus:border-transparent transition shadow-sm"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-fav6 text-sm">
                  🔍
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Category Filter — fades up ── */}
          <motion.div
            className="flex items-center gap-3 mb-12 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          >
            {allCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm
                            font-semibold transition-all duration-300 flex-shrink-0
                            ${
                              activeCategory === cat.name
                                ? "bg-fav1 text-fav3 shadow-lg"
                                : "bg-white text-fav5 border border-fav3 hover:border-fav1 shadow-sm"
                            }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </motion.div>

          {/* ── Mobile Search ── */}
          <motion.div
            className="md:hidden mb-8 relative"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
          >
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-fav3 rounded-full px-5 py-3 pr-10
                         text-sm text-fav5 placeholder:text-fav7
                         focus:outline-none focus:ring-2 focus:ring-fav1 transition shadow-sm"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-fav6">
              🔍
            </span>
          </motion.div>

          {/* ── No Results ── */}
          <AnimatePresence>
            {filteredProducts.length === 0 && (
              <motion.div
                className="text-center py-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <p className="text-5xl mb-4">☕</p>
                <p className="text-fav5 font-bold text-xl mb-2">
                  No items found
                </p>
                <p className="text-fav6 text-sm">
                  Try a different search or category
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Products by Category ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + search}
              className="space-y-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {Object.entries(groupedProducts).map(
                ([category, items], groupIndex) => (
                  <motion.div
                    key={category}
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {/* Category heading */}
                    <motion.div
                      className="flex items-center gap-4 mb-8"
                      variants={fadeUp}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                      <div>
                        <span className="text-xs font-semibold tracking-widest uppercase text-fav6">
                          {items.length} items
                        </span>
                        <h2 className="text-3xl font-bold text-fav5">
                          {category}
                        </h2>
                      </div>
                      <div className="flex-1 h-px bg-fav3/80 ml-4" />
                    </motion.div>

                    {/* Products Grid — cards stagger in */}
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                      variants={cardStagger}
                    >
                      {items.map((product) => (
                        <motion.button
                          key={product._id}
                          variants={cardFadeUp}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          onClick={() => navigate(`/item/${product._id}`)}
                          className="group bg-white rounded-3xl overflow-hidden text-left
                                   shadow-sm hover:shadow-xl transition-all duration-300
                                   hover:-translate-y-1"
                        >
                          {/* Image */}
                          <div className="relative w-full h-44 overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105
                                       transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-fav5/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {!product.inStock && (
                              <div className="absolute top-3 right-3 bg-fav5 text-fav3 text-xs font-semibold px-2.5 py-1 rounded-full">
                                Sold Out
                              </div>
                            )}
                            <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-fav4 text-xs font-semibold px-3 py-1 rounded-full">
                              {product.category}
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-5">
                            <h3 className="font-bold text-fav5 text-base mb-1 group-hover:text-fav1 transition-colors duration-300">
                              {product.name}
                            </h3>
                            <p className="text-xs text-fav6 leading-relaxed line-clamp-2 mb-4">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-fav1">
                                ${product.price.toFixed(2)}
                              </span>
                              <span
                                className="text-xs font-semibold text-fav3 bg-fav4
                                             px-3 py-1.5 rounded-full group-hover:bg-fav1
                                             transition-colors duration-300"
                              >
                                View →
                              </span>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>
                ),
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-fav5 text-fav3 py-12 mt-8">
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
                  <a href="#contact" className="hover:text-fav2 transition">
                    Contact
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

export default Products;
