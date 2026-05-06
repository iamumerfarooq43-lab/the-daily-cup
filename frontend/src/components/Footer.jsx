import React from "react";
import { useNavigate } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Menu", path: "/products" },
    { label: "Health", path: "/health" },
    { label: "Contact", path: "/contact" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer className="bg-gradient-to-b from-neutral-900 to-black text-neutral-300 px-6 md:px-10 py-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
          {/* Brand Info */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">
              The Daily Cup
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Fresh coffee, handcrafted drinks, and delightful bites — delivered
              to your door. Experience quality in every cup.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li
                  key={index}
                  onClick={() => handleNavigation(link.path)}
                  className="text-sm text-neutral-400 hover:text-white cursor-pointer transition-colors duration-200"
                >
                  {link.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Connected - Right Side */}
          <div className="md:text-right">
            <h3 className="text-white font-semibold mb-6 text-lg">
              Stay Connected
            </h3>

            {/* Social Icons */}
            <div className="flex md:justify-end space-x-6 mb-6">
              <Facebook className="cursor-pointer hover:text-white transition-colors duration-200 w-5 h-5" />
              <Instagram className="cursor-pointer hover:text-white transition-colors duration-200 w-5 h-5" />
              <Twitter className="cursor-pointer hover:text-white transition-colors duration-200 w-5 h-5" />
            </div>

            {/* Newsletter */}
            <div className="flex md:flex-row-reverse gap-2">
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
                Join
              </button>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-lg text-black bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 pt-8">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
                Phone
              </p>
              <p className="text-sm text-neutral-300">+92 300 1234567</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
                Email
              </p>
              <p className="text-sm text-neutral-300">support@dailycup.com</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
                Location
              </p>
              <p className="text-sm text-neutral-300">Lahore, Pakistan</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-neutral-800 pt-8 text-center text-xs text-neutral-500">
            © {new Date().getFullYear()} The Daily Cup. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
