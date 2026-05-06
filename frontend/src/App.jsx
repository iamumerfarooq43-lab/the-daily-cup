import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import CartButton from "./components/CartButton";
import CartDrawer from "./components/CartDrawer";
import { Toaster } from "./components/ui/sonner";
import LoadingSpinnerMain from "./components/LoadingSpinnerMain";
import Payment from "./pages/Payment";
import OrderConfirmation from "./pages/OrderConfirmation";


// ── Lazy loaded pages — each page only loads when user visits it ──
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Products = lazy(() => import("./pages/Products"));
const Orders = lazy(() => import("./pages/Orders"));
const Health = lazy(() => import("./pages/Health"));
const ItemDetail = lazy(() => import("./pages/ItemDetail"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const StoryPage = lazy(() => import("./pages/StoryPage"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const ContactCare = lazy(() => import("./pages/ContactPage"));
const Checkout = lazy(() => import("./pages/Checkout"));


// ── Merchant pages (new) ──
const MerchantLogin    = lazy(() => import('./pages/Merchant/MerchantLogin'))
const Dashboard        = lazy(() => import('./pages/Merchant/MerchantDashboard'))

  // // ── Page loading spinner ──
  // const PageLoader = () => (
  //   <div className="min-h-screen bg-fav3 flex items-center justify-center">
  //     <div className="flex flex-col items-center gap-4">
  //       <div
  //         className="w-10 h-10 border-2 border-fav1 border-t-transparent
  //                       rounded-full animate-spin"
  //       />
  //       <p className="text-fav6 text-sm font-medium">Loading...</p>
  //     </div>
  //   </div>
  // );

function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Toaster position="top-center" closeButton />
            <CartButton
              onClick={() => setCartOpen(!cartOpen)}
              cartOpen={cartOpen}
            />
            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

            <Suspense fallback={<LoadingSpinnerMain />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/story" element={<StoryPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/contact" element={<ContactCare />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/health" element={<Health />} />
                <Route path="/item/:id" element={<ItemDetail />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/merchant/login" element={<MerchantLogin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
