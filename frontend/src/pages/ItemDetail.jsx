import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProduct } from "../api/products";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

function ItemDetail() {
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error("Product not found", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Navbar />
        <p className="text-stone-500">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center">
        <Navbar />
        <p className="text-stone-500 text-lg">Product not found.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-sm text-amber-800 underline">
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-stone-500
                     hover:text-stone-800 transition-colors mb-8
                     border border-stone-200 bg-white px-4 py-2
                     rounded-full"
        >
          ← Back
        </button>

        {/* Main content grid */}
        <div className="grid grid-cols-2 gap-12 items-start">
          {/* Left — image */}
          <div
            className="w-full h-80 bg-amber-50 border border-stone-200
                          rounded-2xl flex items-center justify-center
                          text-sm text-stone-400"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right — details */}
          <div>
            {/* Category badge */}
            <span
              className="text-xs bg-amber-50 text-amber-800
                             border border-amber-200 px-3 py-1
                             rounded-full mb-4 inline-block"
            >
              {product.category}
            </span>

            {/* Name */}
            <h1
              className="text-3xl font-medium text-stone-900
                           mb-3 leading-tight"
            >
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-stone-500 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Price */}
            <p className="text-2xl font-medium text-amber-800 mb-6">
              ${product.price.toFixed(2)}
            </p>

            {/* Stock status */}
            {!product.inStock && (
              <p className="text-sm text-red-500 mb-4">
                Currently out of stock
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                disabled={!product.inStock}
                onClick={() => addToCart(product)}
                className={`w-full py-3 rounded-full text-sm font-medium
                            transition-colors
                            ${
                              product.inStock
                                ? "bg-stone-800 text-amber-50 hover:bg-stone-700"
                                : "bg-stone-200 text-stone-400 cursor-not-allowed"
                            }`}
              >
                {product.inStock ? "Add to order" : "Out of stock"}
              </button>

              <button
                onClick={() => navigate("/nutrition")}
                className="w-full py-3 rounded-full text-sm
                           border border-stone-200 bg-white text-stone-700
                           hover:border-amber-700 hover:bg-amber-50
                           transition-colors"
              >
                View nutrition info →
              </button>
            </div>

            {/* Quick nutrition summary */}
            <div className="grid grid-cols-4 gap-3 mt-8">
              {[
                { label: "Calories", value: "120 kcal" },
                { label: "Protein", value: "8g" },
                { label: "Carbs", value: "10g" },
                { label: "Fat", value: "4g" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white border border-stone-200
                                rounded-xl p-3 text-center"
                >
                  <p className="text-sm font-medium text-stone-800">
                    {item.value}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
