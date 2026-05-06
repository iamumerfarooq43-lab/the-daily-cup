import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const DELIVERY_FEE = 2.99;
const SERVICE_FEE = 0.99;

export default function CartDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onLanding = pathname === "/";
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart, cartTotal } = useCart();
  const finalTotal = cartTotal + DELIVERY_FEE + SERVICE_FEE;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-fav5/40 backdrop-blur-sm
                    transition-opacity duration-300
                    ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* ── Drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex flex-col
                    bg-fav3 shadow-2xl transition-transform duration-300
                    ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{
          width: "min(420px, 92vw)",
          paddingTop: "4rem",
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-fav3/80 bg-fav3">
          <div>
            <h2 className="text-xl font-bold text-fav5">Your Cart</h2>
            <p className="text-xs text-fav6 mt-0.5">
              {cart.length === 0
                ? "No items yet"
                : `${cart.reduce((sum, i) => sum + i.quantity, 0)} items`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-fav3
                       flex items-center justify-center text-fav5
                       hover:bg-fav1 hover:text-fav3 hover:border-fav1
                       transition-all duration-300 text-lg font-bold"
          >
            ×
          </button>
        </div>

        {/* ── Cart Items ── */}
        <div
          className="flex-1 overflow-y-auto px-5 py-4 space-y-3
                        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cart.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full gap-4 pb-16">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl shadow-sm">
                🛒
              </div>
              <p className="text-fav5 font-bold text-lg">Cart is empty</p>
              <p className="text-fav6 text-sm text-center max-w-[200px]">
                Add some items from our menu to get started
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-fav1 hover:bg-fav4 text-fav3 px-6 py-2.5
                           rounded-full text-sm font-semibold transition-all duration-300"
              >
                Browse Menu →
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-4 flex items-center gap-4
                           shadow-sm border border-fav3/50"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-fav3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      ☕
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-fav5 text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-fav6 mt-0.5">
                    ${item.price.toFixed(2)} each
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="w-7 h-7 rounded-full bg-fav3 hover:bg-fav1
                                 text-fav5 hover:text-fav3 font-bold text-sm
                                 flex items-center justify-center transition-all duration-200"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-fav5">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-7 h-7 rounded-full bg-fav1 hover:bg-fav4
                                 text-fav3 font-bold text-sm
                                 flex items-center justify-center transition-all duration-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Item total */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-fav1 text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {cart.length > 0 && (
          <div className="px-5 py-5 bg-white border-t border-fav3/50">
            {/* Price breakdown */}
            <div className="space-y-2 mb-4">
              {[
                { label: "Subtotal", value: cartTotal },
                { label: "Delivery Fee", value: DELIVERY_FEE },
                { label: "Service Fee", value: SERVICE_FEE },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center"
                >
                  <span className="text-xs text-fav6">{row.label}</span>
                  <span className="text-xs font-semibold text-fav5">
                    ${row.value.toFixed(2)}
                  </span>
                </div>
              ))}

              {/* Divider */}
              <div className="border-t border-fav3 pt-2 mt-1 flex justify-between items-center">
                <span className="font-bold text-fav5">Total</span>
                <span className="text-xl font-bold text-fav1">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full bg-fav3 border border-fav3
                           text-fav5 text-sm font-semibold
                           hover:bg-fav3/80 transition-all duration-300"
              >
                Keep Shopping
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    alert("Please login to proceed with the order");
                    onClose();
                    navigate("/login");
                    return;
                  }
                  onClose();
                  navigate("/checkout");
                }}
                className="group flex-1 py-3 rounded-full bg-fav1 hover:bg-fav4
                           text-fav3 text-sm font-bold transition-all duration-300
                           shadow-lg flex items-center justify-center gap-2"
              >
                Order Now
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
