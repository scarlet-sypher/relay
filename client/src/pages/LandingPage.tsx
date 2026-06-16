import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils";

const trustBrands = [
  { name: "Urbanic", style: "font-weight:700;letter-spacing:0.02em;" },
  { name: "boat", style: "font-style:italic;font-weight:900;" },
  { name: "zepto", style: "font-weight:700;" },
  { name: "✦ SUGAR", style: "font-weight:700;" },
  { name: "mamaearth", style: "font-weight:700;" },
  { name: "zudio", style: "font-weight:700;" },
  { name: "Nykaa", style: "font-weight:800;letter-spacing:0.04em;" },
  { name: "Meesho", style: "font-weight:700;" },
  { name: "CRED", style: "font-weight:900;letter-spacing:0.08em;" },
  { name: "Bewakoof", style: "font-weight:700;" },
  { name: "Pepperfry", style: "font-style:italic;font-weight:700;" },
  { name: "Lenskart", style: "font-weight:700;" },
];

export const LandingPage = () => {
  const [isEntering, setIsEntering] = useState(false);
  const navigate = useNavigate();

  const handleEnter = () => {
    setIsEntering(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 800);
  };

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 32s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .marquee-wrapper {
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }
      `}</style>
      <div
        className={cn(
          "h-screen font-sans overflow-hidden bg-[#0d1117] text-[#f0f4ff] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] flex flex-col",
          isEntering ? "-translate-y-full" : "translate-y-0"
        )}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* NAV */}
        <nav className="flex items-center justify-between px-8 py-2.5 border-b border-[#252d3e] sticky top-0 z-50 bg-[#0d1117]/85 backdrop-blur-md shrink-0">
          <a href="#" className="flex items-center gap-2 no-underline">
            <div className="w-[30px] h-[30px] rounded-lg bg-[#6c63ff] flex items-center justify-center shadow-[0_0_18px_rgba(108,99,255,0.35)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-white">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="text-[1.05rem] font-bold text-[#f0f4ff]">Relay</span>
          </a>
          <ul className="hidden md:flex gap-6 list-none m-0 p-0">
            <li><a href="#" className="text-[#8892a4] text-[0.85rem] no-underline transition-colors hover:text-[#f0f4ff]">Features</a></li>
            <li><a href="#" className="text-[#8892a4] text-[0.85rem] no-underline transition-colors hover:text-[#f0f4ff]">How It Works</a></li>
            <li><a href="#" className="text-[#8892a4] text-[0.85rem] no-underline transition-colors hover:text-[#f0f4ff]">Why Relay</a></li>
            <li><a href="#" className="text-[#8892a4] text-[0.85rem] no-underline transition-colors hover:text-[#f0f4ff]">Pricing</a></li>
            <li><a href="#" className="text-[#8892a4] text-[0.85rem] no-underline transition-colors hover:text-[#f0f4ff]">Docs</a></li>
          </ul>
          <div className="flex items-center gap-3">
            {/* <button className="bg-transparent border-none text-[#8892a4] text-[0.85rem] cursor-pointer hover:text-[#f0f4ff]">Sign in</button> */}
            <button
              onClick={() => window.open("https://github.com/scarlet-sypher/relay", "_blank")}
              className="bg-[#6c63ff] hover:bg-[#8b82ff] hover:scale-[1.03] text-white border-none rounded-lg px-4 py-2 text-[0.85rem] font-semibold cursor-pointer flex items-center gap-1.5 shadow-[0_0_24px_rgba(108,99,255,0.35)] transition-all duration-200"
            >
              GitHub
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="relative grid grid-cols-1 xl:grid-cols-[300px_1fr_300px] gap-5 items-start content-center px-6 md:px-8 pt-5 pb-4 overflow-hidden max-w-[1440px] mx-auto w-full flex-1 min-h-0">
          {/* Glow blob */}
          <div
            className="absolute -top-[80px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(108,99,255,0.18) 0%, transparent 70%)" }}
          />

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-3">
            {/* Campaign Performance */}
            <div className="bg-[#161c27] border border-[#252d3e] rounded-[12px] overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <span className="text-[0.8rem] font-semibold text-[#f0f4ff]">Campaign Performance</span>
                <span className="bg-[#1e2635] border border-[#252d3e] rounded-md px-2 py-0.5 text-[0.7rem] text-[#8892a4] flex items-center gap-1">
                  This Week ▾
                </span>
              </div>
              <div className="px-4 pb-3">
                <div className="relative h-[80px]">
                  <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#6c63ff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,56 C20,52 35,36 60,40 C80,43 95,58 120,41 C140,29 155,24 180,30 C205,37 225,48 255,44 C275,42 290,40 300,38 L300,80 L0,80 Z" fill="url(#chartGrad)" />
                    <path d="M0,56 C20,52 35,36 60,40 C80,43 95,58 120,41 C140,29 155,24 180,30 C205,37 225,48 255,44 C275,42 290,40 300,38" fill="none" stroke="#6c63ff" strokeWidth="2" />
                    <circle cx="120" cy="41" r="4" fill="#6c63ff" stroke="#fff" strokeWidth="1.5" />
                  </svg>
                  <div className="absolute top-1 left-[52%] bg-[#1e2635] border border-[#252d3e] rounded-md px-2 py-0.5 text-[0.7rem] text-[#8892a4]">
                    Engagement<strong className="block text-[#f0f4ff] text-[0.82rem]">↑ 68.4%</strong>
                  </div>
                </div>
                <div className="flex justify-between pt-1 text-[0.65rem] text-[#5a6475]">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>

            {/* Recent Campaigns */}
            <div className="bg-[#161c27] border border-[#252d3e] rounded-[12px] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#252d3e]">
                <span className="text-[0.8rem] font-semibold text-[#f0f4ff]">Recent Campaigns</span>
              </div>
              {[
                { icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />, color: "#f472b6", name: "Summer Sale 2025", sub: "Sent to 12,450", badge: "Completed", badgeColor: "#22c55e" },
                { icon: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><path d="M8 21h8M12 17v4" /></>, color: "#60a5fa", name: "New Arrivals Drop", sub: "Sent to 8,342", badge: "Sending", badgeColor: "#f59e0b" },
                { icon: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>, color: "#34d399", name: "Cart Abandonment", sub: "Audience: 5,678", badge: "Draft", badgeColor: "#8b82ff" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 px-4 py-2 border-t border-[#252d3e]">
                  <div className="w-[30px] h-[30px] rounded-lg bg-[#1e2635] flex items-center justify-center shrink-0" style={{ color: item.color }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">{item.icon}</svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.78rem] font-medium text-[#f0f4ff] truncate">{item.name}</div>
                    <div className="text-[0.68rem] text-[#8892a4]">{item.sub}</div>
                  </div>
                  <span className="text-[0.66rem] font-semibold rounded-md px-1.5 py-0.5 shrink-0" style={{ background: `${item.badgeColor}22`, color: item.badgeColor }}>{item.badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER COLUMN */}
          <div className="flex flex-col items-center text-center pt-1 z-10">
            <div className="inline-flex items-center gap-2 bg-[#161c27] border border-[#252d3e] rounded-full px-3 py-1 text-[0.74rem] text-[#8892a4] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6c63ff]"></span> Built for Growth Teams
            </div>
            <h1 className="text-[clamp(2.4rem,4.2vw,3.8rem)] font-black leading-[1.05] tracking-[-0.02em] mb-3 text-[#f0f4ff]">
              Your CRM.<br />
              Always In <span className="text-[#8b82ff]">Relay.</span>
            </h1>
            <p className="text-[0.88rem] text-[#8892a4] leading-[1.6] max-w-[420px] mb-30">
              Relay helps you manage customers, create smart segments,<br />
              run targeted campaigns, and track <em className="not-italic underline decoration-[#5a6475]">real results</em><br />
              all in one <em className="not-italic underline decoration-[#5a6475]">connected</em> workspace.
            </p>

            <div className="grid grid-cols-4 gap-2 w-full mb-10">
              {[
                { bg: "#8b5cf6", text: "#a78bfa", label: "Customer Hub", sub: "Unify all customer data", icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
                { bg: "#14b8a6", text: "#2dd4bf", label: "Smart Segments", sub: "Build precise audiences", icon: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /> },
                { bg: "#f97316", text: "#fb923c", label: "Campaigns", sub: "Email, SMS & WhatsApp", icon: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></> },
                { bg: "#6366f1", text: "#818cf8", label: "Live Analytics", sub: "Track delivery & impact", icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> },
              ].map((f, i) => (
                <div key={i} className="bg-[#161c27] border border-[#252d3e] rounded-xl px-2 py-3 flex flex-col items-center gap-1.5 text-center">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${f.bg}33`, color: f.text }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">{f.icon}</svg>
                  </div>
                  <div className="text-[0.75rem] font-semibold text-[#f0f4ff]">{f.label}</div>
                  <div className="text-[0.66rem] text-[#8892a4] leading-[1.35]">{f.sub}</div>
                </div>
              ))}
            </div>

            <button
              onClick={handleEnter}
              className="bg-[#6c63ff] hover:bg-[#8b82ff] hover:scale-[1.04] text-white border-none rounded-[10px] px-7 py-3 text-[0.95rem] font-bold cursor-pointer flex items-center gap-2 shadow-[0_0_32px_rgba(108,99,255,0.35)] transition-all duration-200 mb-2"
            >
              Enter Relay Workspace
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>

            <div className="text-[0.72rem] text-[#5a6475] flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px] text-[#6c63ff]"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
              No credit card required &bull; Get started in seconds
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="bg-[#161c27] border border-[#252d3e] rounded-[12px] overflow-hidden mt-0">
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <span className="text-[0.8rem] font-semibold text-[#f0f4ff]">Live Activity</span>
              <span className="text-[0.72rem] text-[#8b82ff] cursor-pointer">View all</span>
            </div>
            <div className="py-0.5">
              {[
                { icon: "✉", bg: "#10b981", text: "#34d399", title: "Email Delivered", sub: "To: priya@example.com", time: "2s ago" },
                { icon: "💬", bg: "#22c55e", text: "#4ade80", title: "WhatsApp Read", sub: "To: +91 98765 43210", time: "8s ago" },
                { icon: "💬", bg: "#6366f1", text: "#818cf8", title: "SMS Delivered", sub: "To: +91 91234 56789", time: "15s ago" },
                { icon: "🔗", bg: "#f59e0b", text: "#fbbf24", title: "Link Clicked", sub: "Campaign: Summer Sale 2025", time: "22s ago" },
                { icon: "📩", bg: "#ef4444", text: "#f87171", title: "Email Opened", sub: "To: rohan@example.com", time: "45s ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 px-4 py-2 border-t border-[#252d3e]">
                  <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 text-[0.78rem] leading-none" style={{ background: `${item.bg}26`, color: item.text }}>{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.78rem] font-medium text-[#f0f4ff]">{item.title}</div>
                    <div className="text-[0.67rem] text-[#8892a4] truncate">{item.sub}</div>
                  </div>
                  <span className="text-[0.67rem] text-[#5a6475] shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
            <div className="m-2 mx-3 bg-[#1e2635] border border-[#252d3e] rounded-lg px-3 py-1.5 flex items-center gap-2 text-[0.72rem] text-[#8892a4]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0"></span>
              All Systems Operational
            </div>
          </div>
        </section>

        {/* TRUST BAR — Infinite Marquee */}
        <div className="py-3 shrink-0">
          {/* <div className="text-center text-[0.72rem] text-[#5a6475] mb-2">Trusted by growing teams</div> */}
          <div className="marquee-wrapper">
            <div className="marquee-track">
              {[...trustBrands, ...trustBrands].map((brand, i) => (
                <span
                  key={i}
                  className="text-[#5a6475] text-[1.2rem] mx-8 whitespace-nowrap transition-colors duration-200 hover:text-[#8892a4] cursor-default"
                  style={{ ...Object.fromEntries(brand.style.split(";").filter(Boolean).map(s => { const [k, v] = s.split(":"); return [k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v.trim()]; })) }}
                >
                  {brand.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};