import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

const DELIVERY_FEE = 2.99;
const SERVICE_FEE  = 0.99;

const PROMO_CODES = {
  SAVE10:   0.1,
  SAVE20:   0.2,
  WELCOME5: 0.05,
};

const inputClass = `w-full px-4 py-3 bg-fav3/30 border border-fav3
                    rounded-xl text-fav5 placeholder:text-fav7 text-sm
                    focus:outline-none focus:ring-2 focus:ring-fav1
                    focus:border-transparent transition`;

function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal } = useCart();

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    address: "", deliveryInstructions: "", promoCode: "",
  });

  const [error,        setError]        = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError,   setPromoError]   = useState("");
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [geoLoading,   setGeoLoading]   = useState(false);
  const [geoHint,      setGeoHint]      = useState("");

  const appliedPromoKey = formData.promoCode.trim().toUpperCase();
  const discountAmount  = promoApplied && PROMO_CODES[appliedPromoKey]
    ? (cartTotal + DELIVERY_FEE + SERVICE_FEE) * PROMO_CODES[appliedPromoKey]
    : 0;
  const finalTotal = cartTotal + DELIVERY_FEE + SERVICE_FEE - discountAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePromo = () => {
    const raw = formData.promoCode.trim();
    if (!raw) { setPromoError("Please enter a promo code"); return; }
    const code = raw.toUpperCase();
    if (PROMO_CODES[code]) {
      setFormData((prev) => ({ ...prev, promoCode: code }));
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setPromoApplied(false);
    }
  };

  const requestDropoffGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoHint("Your browser does not support location.");
      return;
    }
    setGeoLoading(true);
    setGeoHint("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDropoffLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLoading(false);
        setGeoHint("Drop-off location saved.");
      },
      (err) => {
        setGeoLoading(false);
        setDropoffLocation(null);
        setGeoHint(err?.code === 1
          ? "Location permission is required. Please allow access and try again."
          : "Could not read your location. Check GPS / Wi‑Fi and try again."
        );
      },
      { enableHighAccuracy: true, timeout: 18_000, maximumAge: 0 }
    );
  };

  const handleContinue = () => {
    setError("");
    if (!formData.name.trim())                          { setError("Full name is required"); return; }
    if (!formData.email.trim() || !formData.email.includes("@")) { setError("Valid email is required"); return; }
    if (!formData.phone.trim() || formData.phone.length < 10)    { setError("Valid phone number is required"); return; }
    if (!formData.address.trim())                       { setError("Delivery address is required"); return; }
    if (!dropoffLocation)                               { setError("Please pin your drop-off location."); return; }

    // ✅ Pass everything to /payment via React Router state
    navigate("/payment", {
      state: {
        deliveryInfo: formData,
        dropoffLocation,
        discountAmount,
        promoApplied,
        finalTotal,
        DELIVERY_FEE,
        SERVICE_FEE,
      }
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-fav3 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl mx-auto shadow-sm">🛒</div>
            <p className="text-fav5 font-bold text-xl">Your cart is empty</p>
            <p className="text-fav6 text-sm">Add some items before checking out</p>
            <button onClick={() => navigate("/products")}
              className="mt-2 bg-fav1 hover:bg-fav4 text-fav3 px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300">
              Browse Menu →
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fav3 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="mb-10">
            <button onClick={() => navigate(-1)}
              className="text-fav6 hover:text-fav1 text-sm flex items-center gap-2 mb-4 transition-colors font-medium">
              ← Back
            </button>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-fav1 border border-fav1 px-4 py-1.5 rounded-full mb-4">
              Checkout
            </span>
            <h1 className="text-5xl font-bold text-fav5 leading-tight">
              Complete Your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-fav1">Order</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-fav2 opacity-40 rounded-sm -z-0" />
              </span>
            </h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-10">
            {[
              { num: 1, label: "Delivery Info",   active: true  },
              { num: 2, label: "Payment",          active: false },
              { num: 3, label: "Confirm Order",    active: false },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold
                  ${s.active ? "bg-fav1 text-fav3 shadow-md" : "bg-white text-fav6 border border-fav3"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                    ${s.active ? "bg-fav3/20" : "bg-fav3"}`}>
                    {s.num}
                  </span>
                  {s.label}
                </div>
                {i < 2 && <div className="w-8 h-0.5 rounded-full bg-fav3" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-7 shadow-sm space-y-5">
                <div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-fav6">Step 1</span>
                  <h2 className="text-2xl font-bold text-fav5 mt-1">Delivery Information</h2>
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">
                    <span className="text-lg">⚠️</span>{error}
                  </div>
                )}

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-fav4 mb-2 tracking-wide uppercase">Full Name</label>
                    <input type="text" name="name" value={formData.name}
                      onChange={handleInputChange} placeholder="John Doe" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-fav4 mb-2 tracking-wide uppercase">Email Address</label>
                    <input type="email" name="email" value={formData.email}
                      onChange={handleInputChange} placeholder="john@example.com" className={inputClass} />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-fav4 mb-2 tracking-wide uppercase">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone}
                    onChange={handleInputChange} placeholder="+92 300 1234567" className={inputClass} />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-fav4 mb-2 tracking-wide uppercase">Delivery Address</label>
                  <textarea name="address" value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your full delivery address" rows="3" className={inputClass} />
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-xs font-semibold text-fav4 mb-2 tracking-wide uppercase">
                    Delivery Instructions <span className="text-fav7 normal-case font-normal">(Optional)</span>
                  </label>
                  <textarea name="deliveryInstructions" value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    placeholder="E.g., Ring bell twice, leave at door..." rows="2" className={inputClass} />
                </div>

                {/* GPS */}
                <div className="rounded-2xl border-2 border-fav1/25 bg-fav1/5 p-5 space-y-3">
                  <div>
                    <p className="text-sm font-bold text-fav5">Drop-off pin (required)</p>
                    <p className="text-xs text-fav6 mt-1 leading-relaxed">
                      Allow location access so we can place your delivery on the live map.
                    </p>
                  </div>
                  <button type="button" onClick={requestDropoffGeolocation} disabled={geoLoading}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-fav5 hover:bg-fav4 text-fav3 text-sm font-bold transition-all disabled:opacity-60">
                    {geoLoading ? "Getting location…" : dropoffLocation ? "↻ Refresh my location" : "📍 Use my current location"}
                  </button>
                  {dropoffLocation && (
                    <p className="text-xs text-green-700 font-medium">
                      ✓ Pinned: {dropoffLocation.lat.toFixed(5)}°N, {dropoffLocation.lng.toFixed(5)}°E
                    </p>
                  )}
                  {geoHint && (
                    <p className={`text-xs ${dropoffLocation ? "text-fav6" : "text-amber-800"}`}>{geoHint}</p>
                  )}
                </div>

                {/* Promo */}
                <div>
                  <label className="block text-xs font-semibold text-fav4 mb-2 tracking-wide uppercase">
                    Promo Code <span className="text-fav7 normal-case font-normal">(Optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <input type="text" name="promoCode" value={formData.promoCode}
                      onChange={(e) => { handleInputChange(e); setPromoApplied(false); setPromoError(""); }}
                      placeholder="Enter promo code" className={`${inputClass} flex-1`} />
                    <button type="button" onClick={handlePromo}
                      className="px-5 py-3 bg-fav4 hover:bg-fav5 text-fav3 rounded-xl text-sm font-semibold transition-all duration-300">
                      Apply
                    </button>
                  </div>
                  {promoError  && <p className="text-xs text-red-500 mt-1.5">⚠️ {promoError}</p>}
                  {promoApplied && <p className="text-xs text-green-600 mt-1.5 font-semibold">✓ Promo applied! You save ${discountAmount.toFixed(2)}</p>}
                  <p className="text-xs text-fav7 mt-2">Try: SAVE10, SAVE20, WELCOME5</p>
                </div>

                <button type="button" onClick={handleContinue}
                  className="group w-full py-3.5 rounded-full bg-fav1 hover:bg-fav4 text-fav3 font-bold text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2">
                  Continue to Payment
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>

            {/* Right — order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24 space-y-5">
                <div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-fav6">Summary</span>
                  <h2 className="text-xl font-bold text-fav5 mt-1">Your Order</h2>
                </div>
                <div className="space-y-3 max-h-52 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {cart.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-fav3">
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-base">☕</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-fav5 truncate">{item.name}</p>
                        <p className="text-xs text-fav6">× {item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-fav4 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-fav3 pt-4 space-y-2">
                  {[
                    { label: "Subtotal",     value: `$${cartTotal.toFixed(2)}`,    color: "text-fav5" },
                    { label: "Delivery Fee", value: `$${DELIVERY_FEE.toFixed(2)}`, color: "text-fav5" },
                    { label: "Service Fee",  value: `$${SERVICE_FEE.toFixed(2)}`,  color: "text-fav5" },
                    ...(promoApplied && discountAmount > 0
                      ? [{ label: "Discount", value: `-$${discountAmount.toFixed(2)}`, color: "text-green-600" }]
                      : []),
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="text-xs text-fav6">{row.label}</span>
                      <span className={`text-xs font-semibold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-fav3 pt-4 flex justify-between items-center">
                  <span className="font-bold text-fav5">Total</span>
                  <span className="text-2xl font-bold text-fav1">${finalTotal.toFixed(2)}</span>
                </div>
                <div className="bg-fav3/50 rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-2xl">🚴</span>
                  <div>
                    <p className="text-xs font-bold text-fav5">Estimated Delivery</p>
                    <p className="text-xs text-fav6">25 — 35 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-fav5 text-fav3 py-8 mt-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-fav7">© 2024 The Daily Cup. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Checkout;