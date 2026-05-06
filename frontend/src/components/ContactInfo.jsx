import { useState } from "react";

const contactDetails = [
  { department: "Orders & Delivery", phone: "+1 (555) 123-4567", icon: "📦" },
  { department: "Technical Support", phone: "+1 (555) 234-5678", icon: "🛠️" },
  { department: "General Inquiries", phone: "+1 (555) 345-6789", icon: "☎️" },
];

const ContactInfo = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="bg-fav5 rounded-3xl p-6 shadow-sm">
        <p className="font-bold text-fav3 text-base mb-3">Email Us</p>
        <p className="text-fav7 text-xs mb-3">We'll respond within 24 hours.</p>
        <a
          href="mailto:support@coffeeshop.com"
          className="text-fav2 font-semibold text-sm"
        >
          support@coffeeshop.com
        </a>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm flex-1">
        <p className="font-bold text-fav5 text-base mb-5">Call Us</p>
        <div className="space-y-4">
          {contactDetails.map((detail, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-fav3/50 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span>{detail.icon}</span>
                <p className="text-xs font-semibold text-fav6">
                  {detail.department}
                </p>
              </div>
              <a
                href={"tel:" + detail.phone}
                className="text-fav1 font-bold text-xs"
              >
                {detail.phone}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-fav1 rounded-3xl p-6 shadow-sm">
        <p className="font-bold text-fav3 text-base mb-3">Live Chat</p>
        <p className="text-fav3/80 text-xs mb-4">
          Chat with our team for instant support.
        </p>
        <button
          onClick={() => setShowChat(true)}
          className="w-full bg-fav5 hover:bg-fav4 text-fav3 font-semibold py-3 rounded-full text-sm transition-all"
        >
          Start Live Chat
        </button>
      </div>

      {showChat && (
        <div className="fixed inset-0 bg-fav5/60 backdrop-blur-sm flex items-end justify-end p-6 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm h-[420px] flex flex-col overflow-hidden">
            <div className="bg-fav4 text-fav3 p-4 flex justify-between items-center">
              <p className="font-bold text-sm">Coffee Shop Support</p>
              <button onClick={() => setShowChat(false)} className="text-xl">
                x
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-fav3/20">
              <div className="bg-white rounded-2xl p-3 w-fit shadow-sm">
                <p className="text-sm text-fav5">Hi! How can we help you? ☕</p>
              </div>
            </div>
            <div className="border-t border-fav3 p-3 flex gap-2 bg-white">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-fav3/30 border border-fav3 rounded-full text-fav5 text-sm focus:outline-none focus:ring-2 focus:ring-fav1"
              />
              <button className="bg-fav4 text-fav3 px-4 py-2 rounded-full text-sm font-semibold">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;
