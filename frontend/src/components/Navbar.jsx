import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

const navLinks = [
  { label: "Home", to: "/", icon: "🏠" },
  { label: "Menu", to: "/products", icon: "☕" },
  { label: "Health", to: "/health", icon: "🌿" },
  { label: "Orders", to: "/orders", icon: "📦" },
];

// ── SVG: dark-red cup + soft steam wisps ──
const CupLogo = ({ size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <defs>
      <linearGradient id="tdc-cup" x1="10" y1="38" x2="34" y2="14">
        <stop stopColor="#7f1d1d" />
        <stop offset="0.45" stopColor="#991b1b" />
        <stop offset="1" stopColor="#450a0a" />
      </linearGradient>
      <linearGradient id="tdc-rim" x1="8" y1="15" x2="40" y2="15">
        <stop stopColor="#2a0a0a" />
        <stop offset="1" stopColor="#5c0f0f" />
      </linearGradient>
    </defs>
    {/* Steam */}
    <path
      d="M15 16c-1.5-3-1-6 0.5-9"
      stroke="rgba(255,248,240,0.55)"
      strokeWidth="1.35"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M22 17c-2-4.5-1-8.5 1.5-13"
      stroke="rgba(255,248,240,0.75)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M30 16c1.8-3.2 1.2-6.5-0.2-9.5"
      stroke="rgba(255,248,240,0.45)"
      strokeWidth="1.25"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M18 12c0.8-2.2 0.5-4.5-0.5-6.5"
      stroke="rgba(255,248,240,0.35)"
      strokeWidth="1.1"
      strokeLinecap="round"
      fill="none"
    />
    {/* Cup */}
    <path
      d="M10 18h28l-3.2 19H13.2L10 18z"
      fill="url(#tdc-cup)"
      stroke="#2a0a0a"
      strokeWidth="0.5"
    />
    <rect x="8.5" y="15.5" width="31" height="5" rx="2.2" fill="url(#tdc-rim)" />
    <ellipse cx="24" cy="18" rx="13" ry="2.2" fill="rgba(0,0,0,0.2)" />
    {/* Handle */}
    <path
      d="M36 21h4.2a4.2 4.2 0 0 1 0 8.4H36"
      stroke="#450a0a"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Highlight */}
    <path
      d="M16 24q1.2 5 1 10"
      stroke="rgba(255,255,255,0.22)"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLanding = pathname === "/";

  const handleContact = () => {
    setMenuOpen(false);
    if (isLanding) {
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#contact");
    }
  };

  const handleLogout = () => {
    const name = user?.name;
    setMenuOpen(false);
    logout();
    toast.success(
      name ? `Signed out. See you soon, ${name}!` : "Signed out successfully.",
    );
    navigate("/");
  };

  return (
    <>
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-500
                       top-0
                       ${
                         isLanding
                           ? "bg-fav5/60 backdrop-blur-md border-b border-fav4/20"
                           : "bg-fav4 backdrop-blur-md border-b border-fav3 shadow-sm"
                       }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className={`p-1.5 rounded-xl transition-all duration-300
                             ${isLanding ? "bg-fav4/30" : "bg-fav3"}`}
            >
              <CupLogo size={20} />
            </div>
            <div>
              <p
                className={`text-sm font-bold tracking-tight leading-none
                             ${isLanding ? "text-fav3" : "text-fav5"}`}
              >
                The daily Cup
              </p>
              <p
                className={`text-[10px] font-medium tracking-wide leading-snug mt-1 max-w-[10rem]
                             ${isLanding ? "text-fav7/70" : "text-fav6"}`}
              >
                Lahore · Artisan coffee & fresh pastries daily
              </p>
            </div>
          </Link>

          {/* ── Center Nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-xs font-semibold
                            transition-all duration-300 rounded-xl group
                            ${
                              pathname === link.to
                                ? isLanding
                                  ? "text-fav2"
                                  : "text-fav1"
                                : isLanding
                                  ? "text-fav3/60 hover:text-fav3"
                                  : "text-fav6 hover:text-fav5"
                            }`}
              >
                {link.label}
                {/* Active underline */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5
                                  rounded-full transition-all duration-300
                                  ${
                                    pathname === link.to
                                      ? "w-4 bg-fav1"
                                      : "w-0 group-hover:w-4 bg-fav6"
                                  }`}
                />
              </Link>
            ))}
            <button
              onClick={handleContact}
              className={`relative px-4 py-2 text-xs font-semibold
                          transition-all duration-300 rounded-xl group
                          ${isLanding ? "text-fav3/60 hover:text-fav3" : "text-fav6 hover:text-fav5"}`}
            >
              Contact
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0
                               group-hover:w-4 bg-fav6 rounded-full transition-all duration-300"
              />
            </button>
          </div>

          {/* ── Right ── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Divider */}
            <div
              className={`w-px h-6 ${isLanding ? "bg-fav4/40" : "bg-fav3"}`}
            />

            {user ? (
              <>
                {/* Avatar + name */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                                   text-xs font-bold flex-shrink-0
                                   ${isLanding ? "bg-fav2 text-fav5" : "bg-fav1 text-fav3"}`}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p
                      className={`text-[10px] leading-none ${isLanding ? "text-fav7/60" : "text-fav6"}`}
                    >
                      Welcome 👋
                    </p>
                    <p
                      className={`text-xs font-bold leading-none mt-0.5
                                   ${isLanding ? "text-fav3" : "text-fav5"}`}
                    >
                      {user.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold px-4 py-2 rounded-full
                             border border-red-400/40 text-red-400
                             hover:bg-red-500 hover:text-white hover:border-red-500
                             transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`text-xs font-semibold px-4 py-2 rounded-full border
                              transition-all duration-300
                              ${
                                isLanding
                                  ? "border-fav3/30 text-fav3 hover:bg-white/10"
                                  : "border-fav3 text-fav5 hover:bg-fav3"
                              }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`text-xs font-bold px-4 py-2 rounded-full
                              transition-all duration-300 shadow-sm
                              ${
                                isLanding
                                  ? "bg-fav2 text-fav5 hover:bg-fav3"
                                  : "bg-fav1 text-fav3 hover:bg-fav4"
                              }`}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden w-9 h-9 rounded-xl flex flex-col items-center
                         justify-center gap-1.5 transition-colors
                         ${isLanding ? "hover:bg-white/10" : "hover:bg-fav3"}`}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-0.5 rounded-full transition-all duration-300
                            ${isLanding ? "bg-fav3" : "bg-fav5"}
                            ${
                              i === 0
                                ? `w-5 ${menuOpen ? "rotate-45 translate-y-2" : ""}`
                                : i === 1
                                  ? `w-3 ${menuOpen ? "opacity-0 w-0" : ""}`
                                  : `w-5 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`
                            }`}
              />
            ))}
          </button>
        </div>

        {/* ── Bottom accent line ── */}
        <div
          className={`h-0.5 w-full transition-opacity duration-300
                         ${isLanding ? "opacity-0" : "opacity-100"}
                         bg-gradient-to-r from-transparent via-fav1 to-transparent`}
        />
      </nav>

      {/* ── Mobile Menu ── */}
      <div
        className={`fixed left-0 right-0 z-40 bg-white border-b border-fav3 shadow-xl
                       overflow-hidden transition-all duration-300
                       top-16
                       ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm
                          font-semibold transition-all
                          ${
                            pathname === link.to
                              ? "bg-fav1 text-fav3"
                              : "text-fav5 hover:bg-fav3"
                          }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleContact}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-fav5 hover:bg-fav3 transition-all"
          >
            <span>📬</span>
            Contact
          </button>

          <div className="border-t border-fav3 pt-3 mt-2">
            {user ? (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-fav1 flex items-center justify-center text-fav3 font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[10px] text-fav6">Welcome</p>
                    <p className="text-sm font-bold text-fav5">{user.name}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs px-4 py-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3 px-2 py-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-3 rounded-2xl border border-fav3 text-fav5 text-sm font-semibold hover:bg-fav3 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-3 rounded-2xl bg-fav1 text-fav3 text-sm font-bold hover:bg-fav4 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-fav5/20 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;
