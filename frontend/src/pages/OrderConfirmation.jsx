import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { createOrder } from "../api/orders";
import { toast } from "sonner";

function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, cartTotal, clearCart } = useCart();

  const state = location.state;

  if (!state?.deliveryInfo || !state?.paymentInfo) {
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
    paymentInfo,
  } = state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getPaymentDisplay = () => {
    const { type, details } = paymentInfo;
    if (type === "cash") return { icon: "💵", label: "Cash on Delivery" };
    if (type === "digital-wallet") {
      const wallet = details.wallet === "easypaisa" ? "Easypaisa" : "JazzCash";
      return {
        icon: details.wallet === "easypaisa" ? "🟢" : "🔴",
        label: wallet,
        phone: details.walletPhone,
      };
    }
    if (type === "credit-card")
      return {
        icon: "💳",
        label: "Credit Card",
        lastFour: details.cardNumber?.slice(-4),
      };
    if (type === "debit-card")
      return {
        icon: "🏧",
        label: "Debit Card",
        lastFour: details.cardNumber?.slice(-4),
      };
    return { icon: "💳", label: "Payment" };
  };

  const paymentDisplay = getPaymentDisplay();

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const orderData = {
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        deliveryAddress: deliveryInfo.address,
        specialInstructions: deliveryInfo.deliveryInstructions || "",
        dropoffLocation,
        paymentMethod: paymentInfo.type,
      };
      const order = await createOrder(orderData);
      clearCart();
      toast.success(`Order placed! 🎉 ${order.orderNumber}`, {
        duration: 6000,
      });
      navigate("/orders");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Could not place order. Please try again.";
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fav3 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-fav6 hover:text-fav1 text-sm flex items-center gap-2 mb-4 transition-colors font-medium"
            >
              ← Back
            </button>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-fav1 border border-fav1 px-4 py-1.5 rounded-full mb-4">
              Almost There!
            </span>
            {/* ✅ Responsive heading */}
            <h1 className="text-3xl sm:text-5xl font-bold text-fav5 leading-tight">
              Review Your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-fav1">Order</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-fav2 opacity-40 rounded-sm -z-0" />
              </span>
            </h1>
          </div>

          {/* Step indicator — wraps on mobile */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {[
              { num: 1, label: "Delivery Info", done: true, active: false },
              { num: 2, label: "Payment", done: true, active: false },
              { num: 3, label: "Confirm Order", done: false, active: true },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold
                  ${s.active ? "bg-fav1 text-fav3 shadow-md" : s.done ? "bg-fav4 text-fav3" : "bg-white text-fav6 border border-fav3"}`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                    ${s.active || s.done ? "bg-fav3/20" : "bg-fav3"}`}
                  >
                    {s.done ? "✓" : s.num}
                  </span>
                  {s.label}
                </div>
                {i < 2 && (
                  <div
                    className={`w-6 h-0.5 rounded-full ${s.done ? "bg-fav4" : "bg-fav3"}`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">
              <span className="text-lg">⚠️</span>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left — review details */}
            <div className="lg:col-span-3 space-y-5">
              {/* Order items */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-fav5 text-lg">Order Items</h3>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 py-2 border-b border-fav3/40 last:border-0"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-fav3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">
                            ☕
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-fav5 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-fav6">× {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-fav4">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery info */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
                <h3 className="font-bold text-fav5 text-lg">
                  Delivery Details
                </h3>
                {[
                  { icon: "👤", label: "Name", value: deliveryInfo.name },
                  { icon: "✉️", label: "Email", value: deliveryInfo.email },
                  { icon: "📞", label: "Phone", value: deliveryInfo.phone },
                  { icon: "📍", label: "Address", value: deliveryInfo.address },
                  ...(deliveryInfo.deliveryInstructions
                    ? [
                        {
                          icon: "📝",
                          label: "Instructions",
                          value: deliveryInfo.deliveryInstructions,
                        },
                      ]
                    : []),
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-fav3 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      {row.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-fav6 font-semibold uppercase tracking-wide">
                        {row.label}
                      </p>
                      <p className="text-sm text-fav5 break-words">
                        {row.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm">
                <h3 className="font-bold text-fav5 text-lg mb-4">
                  Payment Method
                </h3>
                <div className="flex items-center gap-4 p-4 bg-fav3/50 rounded-2xl border border-fav3">
                  <span className="text-3xl">{paymentDisplay.icon}</span>
                  <div>
                    <p className="font-bold text-fav5">
                      {paymentDisplay.label}
                    </p>
                    {paymentDisplay.lastFour && (
                      <p className="text-xs text-fav6">
                        •••• •••• •••• {paymentDisplay.lastFour}
                      </p>
                    )}
                    {paymentDisplay.phone && (
                      <p className="text-xs text-fav6">
                        {paymentDisplay.phone}
                      </p>
                    )}
                  </div>
                  <span className="ml-auto text-green-600 font-bold">✓</span>
                </div>
              </div>
            </div>

            {/* Right — price summary + confirm */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm lg:sticky lg:top-24 space-y-5">
                <div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-fav6">
                    Final Summary
                  </span>
                  <h2 className="text-xl font-bold text-fav5 mt-1">
                    Price Breakdown
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      label: "Subtotal",
                      value: `$${cartTotal.toFixed(2)}`,
                      color: "text-fav5",
                    },
                    {
                      label: "Delivery Fee",
                      value: `$${DELIVERY_FEE.toFixed(2)}`,
                      color: "text-fav5",
                    },
                    {
                      label: "Service Fee",
                      value: `$${SERVICE_FEE.toFixed(2)}`,
                      color: "text-fav5",
                    },
                    ...(discountAmount > 0
                      ? [
                          {
                            label: "Discount",
                            value: `-$${discountAmount.toFixed(2)}`,
                            color: "text-green-600",
                          },
                        ]
                      : []),
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-center"
                    >
                      <span className="text-xs text-fav6">{row.label}</span>
                      <span className={`text-xs font-semibold ${row.color}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-fav3 pt-4 flex justify-between items-center">
                  <span className="font-bold text-fav5">Total</span>
                  <span className="text-2xl font-bold text-fav1">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>

                <div className="bg-fav3/50 rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-2xl">🚴</span>
                  <div>
                    <p className="text-xs font-bold text-fav5">
                      Estimated Delivery
                    </p>
                    <p className="text-xs text-fav6">25 — 35 minutes</p>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="group w-full py-4 rounded-full bg-fav1 hover:bg-fav4 disabled:bg-fav6 text-fav3 font-bold text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-fav3/30 border-t-fav3 rounded-full animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      ✓ Confirm & Place Order
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </>
                  )}
                </button>

                <p className="text-xs text-fav7 text-center">
                  By placing your order you agree to our terms of service
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-fav5 text-fav3 py-8 mt-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-fav7">
            © 2024 The Daily Cup. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default OrderConfirmation;
