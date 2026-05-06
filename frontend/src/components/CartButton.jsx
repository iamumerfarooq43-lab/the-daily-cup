import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartButton({ onClick, cartOpen }) {
  const { pathname } = useLocation();
  const { cartQuantity } = useCart();
  const onLanding = pathname === "/";

  return (
    <button
      onClick={onClick}
      aria-label="Open cart"
      style={{ right: 0 }}
      className={`fixed z-50 top-24
                  rounded-tl-2xl rounded-bl-2xl
                  flex flex-col items-center justify-center
                  shadow-2xl transition-all duration-300
                  ${
                    cartOpen
                      ? "bg-fav5 w-10 h-16 gap-1"
                      : "bg-fav5 hover:bg-fav4 w-12 h-20 gap-1.5"
                  }`}
    >
      {/* Top accent line */}
      <div
        className={`w-5 h-0.5 bg-fav2 rounded-full transition-all duration-300
                       ${cartOpen ? "w-3" : "w-5"}`}
      />

      {/* Cart icon */}
      <div className="relative flex items-center justify-center">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f2cfae"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>

        {/* Badge */}
        {cartQuantity > 0 && (
          <span
            className="absolute -top-2 -right-2 w-4 h-4 bg-fav2
                           rounded-full text-fav5 text-[9px] font-bold
                           flex items-center justify-center shadow-sm"
          >
            {cartQuantity > 9 ? "9+" : cartQuantity}
          </span>
        )}
      </div>

      {/* Item count label */}
      {cartQuantity > 0 ? (
        <span className="text-fav2 text-[10px] font-bold leading-none">
          {cartQuantity} item{cartQuantity > 1 ? "s" : ""}
        </span>
      ) : (
        <span className="text-fav7 text-[9px] font-medium leading-none tracking-wide uppercase">
          Cart
        </span>
      )}

      {/* Bottom accent line */}
      <div
        className={`h-0.5 bg-fav4 rounded-full transition-all duration-300
                       ${cartOpen ? "w-3" : "w-5"}`}
      />
    </button>
  );
}
