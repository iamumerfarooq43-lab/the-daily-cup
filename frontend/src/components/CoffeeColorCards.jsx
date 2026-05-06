import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProducts } from "../api/products";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const cardStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardFadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const CoffeeColorCards = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetch = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetch();
  }, []);
  
  const coffeeItems = products.slice(0, 4);
  
  return (
    <section className="w-full bg-stone-100 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ── Section Header ── */}
        <motion.div
          className="flex items-end justify-between mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-fav1 border border-fav1 px-4 py-1.5 rounded-full mb-4">
              Our Favourites
            </span>
            <h2 className="text-5xl font-bold text-fav5 leading-tight">
              A Colour for{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-fav1">Every Cup</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-fav2 opacity-40 rounded-sm -z-0" />
              </span>
            </h2>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="group hidden md:flex items-center gap-2 text-sm font-semibold text-fav4 hover:text-fav1 transition-colors duration-300 mb-2"
          >
            Explore all
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </button>
        </motion.div>

        {/* ── Cards Grid — stagger each card ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={cardStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {coffeeItems.map((item) => (
            <motion.div
              key={item._id}
              variants={cardFadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={() => navigate(`/item/${item._id}`)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm
                         hover:shadow-xl transition-all duration-300 cursor-pointer
                         hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative w-full h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-fav5/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {!item.inStock && (
                  <div className="absolute top-3 right-3 bg-fav5 text-fav3 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Sold Out
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5">
                <p className="text-xs font-semibold tracking-widest uppercase text-fav6 mb-1">
                  {item.category}
                </p>
                <h3 className="font-bold text-fav5 text-lg leading-snug mb-2 group-hover:text-fav1 transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-xs text-fav6 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile explore button */}
        <motion.div
          className="mt-10 text-center md:hidden"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <button
            onClick={() => navigate("/products")}
            className="text-sm font-semibold text-fav4 hover:text-fav1 transition-colors"
          >
            Explore all →
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CoffeeColorCards;
