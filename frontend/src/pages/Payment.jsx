import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import easypaisaImg from "../assets/easypaisa.webp";
import jazzcashImg from "../assets/jazzcash.webp";

const inputClass = `w-full px-4 py-2.5 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-amber-500
                    focus:border-transparent transition text-sm`;

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, cartTotal, clearCart } = useCart();

  const state = location.state;

  // Guard — if someone visits /payment directly
  if (!state?.deliveryInfo) {
    navigate("/checkout");
    return null;
  }

  const {
    deliveryInfo,
    dropoffLocation,
    discountAmount,
    finalTotal,
    DELIVERY_FEE,
    SERVICE_FEE,
  } = state;

  const [paymentType, setPaymentType] = useState(""); // "online" | "cash"
  const [onlineTab, setOnlineTab] = useState("credit-card");
  const [wallet, setWallet] = useState(""); // "easypaisa" | "jazzcash"
  const [walletPhone, setWalletPhone] = useState("");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 16);
      const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
      setCardData((prev) => ({ ...prev, cardNumber: formatted }));
      return;
    }
    if (name === "expiry") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      const formatted =
        digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
      setCardData((prev) => ({ ...prev, expiry: formatted }));
      return;
    }
    if (name === "cvv") {
      setCardData((prev) => ({
        ...prev,
        cvv: value.replace(/\D/g, "").slice(0, 3),
      }));
      return;
    }
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!paymentType) {
      setError("Please select a payment method.");
      return false;
    }
    if (paymentType === "online") {
      if (onlineTab === "digital-wallet") {
        if (!wallet) {
          setError("Please select Easypaisa or JazzCash.");
          return false;
        }
        if (!walletPhone.trim() || walletPhone.replace(/\D/g, "").length < 10) {
          setError("Please enter a valid wallet phone number.");
          return false;
        }
      } else {
        if (cardData.cardNumber.replace(/\s/g, "").length < 16) {
          setError("Please enter a valid 16-digit card number.");
          return false;
        }
        if (!cardData.cardName.trim()) {
          setError("Cardholder name is required.");
          return false;
        }
        if (cardData.expiry.length < 5) {
          setError("Please enter a valid expiry (MM/YY).");
          return false;
        }
        if (cardData.cvv.length < 3) {
          setError("Please enter a valid 3-digit CVV.");
          return false;
        }
      }
    }
    return true;
  };

  // ✅ Validates payment and redirects to order confirmation
  const handleContinueToConfirmation = () => {
    setError("");
    if (!validate()) return;

    // Prepare payment info
    const paymentInfo = {
      type:
        paymentType === "cash"
          ? "cash"
          : onlineTab === "digital-wallet"
            ? "digital-wallet"
            : onlineTab,
      details:
        paymentType === "cash"
          ? {}
          : onlineTab === "digital-wallet"
            ? { wallet, walletPhone }
            : { ...cardData },
    };

    // Redirect to order confirmation with payment info
    navigate("/order-confirmation", {
      state: {
        deliveryInfo,
        dropoffLocation,
        discountAmount,
        finalTotal,
        DELIVERY_FEE,
        SERVICE_FEE,
        paymentInfo,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <Navbar />

      <div className="flex-1 flex items-center justify-center pt-24 pb-16 px-4 overflow-x-hidden">
        <div className="w-full max-w-md mx-auto">
          {/* ── Header — matches Register style ── */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              💳
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment</h1>
            <p className="text-gray-600 text-sm">
              Choose how you'd like to pay for your order
            </p>
          </div>

          {/* ── Card — matches Register card exactly ── */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            {/* Order total summary */}
            <div className="flex justify-between items-center p-3 bg-amber-50 border border-amber-200 rounded-lg mb-5">
              <span className="text-sm font-semibold text-gray-700">
                Order Total
              </span>
              <span className="text-lg font-bold text-amber-700">
                ${finalTotal.toFixed(2)}
              </span>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            {/* ── Step 1: Payment type ── */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "online",
                    label: "Pay Online",
                    icon: "💳",
                    sub: "Card or Wallet",
                  },
                  {
                    value: "cash",
                    label: "Cash on Delivery",
                    icon: "💵",
                    sub: "Pay on arrival",
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setPaymentType(opt.value);
                      setError("");
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 text-center
                      ${
                        paymentType === opt.value
                          ? "border-amber-600 bg-amber-50"
                          : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
                      }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <p
                      className={`text-xs font-bold ${paymentType === opt.value ? "text-amber-700" : "text-gray-700"}`}
                    >
                      {opt.label}
                    </p>
                    <p className="text-xs text-gray-500">{opt.sub}</p>
                    {paymentType === opt.value && (
                      <span className="text-amber-600 text-xs font-bold">
                        ✓ Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Step 2: Online payment details ── */}
            {paymentType === "online" && (
              <div className="space-y-4">
                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-0.5 bg-gray-200" />
                  <span className="text-xs text-gray-500 font-semibold">
                    Payment Details
                  </span>
                  <div className="flex-1 h-0.5 bg-gray-200" />
                </div>

                {/* Tabs — Credit / Debit / Wallet */}
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                  {[
                    { key: "credit-card", label: "Credit Card", icon: "💳" },
                    { key: "debit-card", label: "Debit Card", icon: "🏧" },
                    { key: "digital-wallet", label: "Wallet", icon: "📱" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => {
                        setOnlineTab(tab.key);
                        setError("");
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all duration-200
                        ${
                          onlineTab === tab.key
                            ? "bg-white text-amber-700 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      <span>{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Credit / Debit Card form */}
                {(onlineTab === "credit-card" ||
                  onlineTab === "debit-card") && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={handleCardChange}
                        placeholder="John Doe"
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expiry
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardData.expiry}
                          onChange={handleCardChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="password"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardChange}
                          placeholder="•••"
                          maxLength={3}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    {/* Security note */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="text-sm">🔒</span>
                      <p className="text-xs text-gray-500">
                        Simulated payment — no real charges will be made.
                      </p>
                    </div>
                  </div>
                )}

                {/* Digital Wallet */}
                {onlineTab === "digital-wallet" && (
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Select Wallet Provider
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          key: "easypaisa",
                          label: "Easypaisa",
                          img: easypaisaImg,
                          activeColor: "border-green-500 bg-green-50",
                          textColor: "text-green-700",
                        },
                        {
                          key: "jazzcash",
                          label: "JazzCash",
                          img: jazzcashImg,
                          activeColor: "border-red-500 bg-red-50",
                          textColor: "text-red-700",
                        },
                      ].map((w) => (
                        <button
                          key={w.key}
                          type="button"
                          onClick={() => {
                            setWallet(w.key);
                            setError("");
                          }}
                          className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200
        ${
          wallet === w.key
            ? w.activeColor
            : "border-gray-200 hover:border-gray-300"
        }`}
                        >
                          <img
                            src={w.img}
                            alt={w.label}
                            className="w-10 h-10 object-contain"
                          />
                          <span
                            className={`text-xs font-bold ${wallet === w.key ? w.textColor : "text-gray-700"}`}
                          >
                            {w.label}
                          </span>
                          {wallet === w.key && (
                            <span
                              className={`text-xs font-bold ${w.textColor}`}
                            >
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {wallet && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {wallet === "easypaisa" ? "Easypaisa" : "JazzCash"}{" "}
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={walletPhone}
                          onChange={(e) => setWalletPhone(e.target.value)}
                          placeholder="03XX XXXXXXX"
                          className={inputClass}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Enter the number registered with your wallet
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="text-sm">🔒</span>
                      <p className="text-xs text-gray-500">
                        Simulated payment — no real charges will be made.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cash on Delivery confirmation */}
            {paymentType === "cash" && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mt-2">
                <span className="text-2xl">💵</span>
                <div>
                  <p className="text-sm font-bold text-gray-700">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Please have{" "}
                    <span className="font-bold text-amber-700">
                      ${finalTotal.toFixed(2)}
                    </span>{" "}
                    ready when your order arrives.
                  </p>
                </div>
              </div>
            )}

            {/* ── Place Order button — matches Register button style ── */}
            <button
              type="button"
              onClick={handleContinueToConfirmation}
              disabled={loading || !paymentType}
              className="w-full mt-6 bg-amber-700 hover:bg-amber-800 disabled:bg-gray-300
                         text-white font-semibold py-2.5 rounded-lg transition-colors
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Continuing...
                </>
              ) : (
                "Continue to Confirm →"
              )}
            </button>

            {/* Back link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              <button
                onClick={() => navigate(-1)}
                className="font-semibold text-amber-700 hover:text-amber-800 transition"
              >
                ← Back to Checkout
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-100 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-stone-400">
            © 2024 The Daily Cup. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Payment;
