import { useState, useEffect, useRef } from "react";

// ─── SEED DATA ──────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: "🛒", title: "Online Store Setup", desc: "Full e-commerce store — product catalog, payments, and shipping." },
  { icon: "📈", title: "Digital Marketing", desc: "Social media, Google Ads, SEO — right audience, every time." },
  { icon: "📊", title: "Analytics & Reporting", desc: "Real-time dashboards and Google Sheets reporting." },
  { icon: "💳", title: "Payment Integration", desc: "UPI, cards, wallets, international payments." },
  { icon: "📦", title: "Inventory Management", desc: "Sync offline stock with your online store." },
  { icon: "🤝", title: "Ongoing Support", desc: "Dedicated account manager as your business grows." },
];

const JOBS = [
  { id: 1, title: "Digital Marketing Specialist", type: "Full-Time", location: "Remote", dept: "Marketing", desc: "Drive online growth for clients." },
  { id: 2, title: "E-Commerce Manager", type: "Full-Time", location: "Mumbai", dept: "Operations", desc: "Manage online storefronts." },
  { id: 3, title: "Business Development Exec", type: "Full-Time", location: "Delhi", dept: "Sales", desc: "Onboard offline businesses." },
  { id: 4, title: "Web & UX Designer", type: "Contract", location: "Remote", dept: "Design", desc: "Design digital experiences." },
  { id: 5, title: "SEO & Content Strategist", type: "Part-Time", location: "Remote", dept: "Marketing", desc: "Build content pipelines." },
];

const INIT_PROPOSALS = [
  { id: "PRO-001", date: "2025-03-01", client: "Meena Textiles", email: "meena@textiles.com", phone: "9820001111", service: "Online Store Setup", budget: "₹75,000", timeline: "4 weeks", status: "Approved", payment: "Paid", retailerId: null },
  { id: "PRO-002", date: "2025-03-14", client: "Ravi Spices", email: "ravi@spices.in", phone: "9821002222", service: "Digital Marketing", budget: "₹35,000", timeline: "2 months", status: "Pending", payment: "Unpaid", retailerId: "R001" },
  { id: "PRO-003", date: "2025-04-02", client: "Arora Electronics", email: "arora@electronics.com", phone: "9822003333", service: "Payment Integration", budget: "₹20,000", timeline: "1 week", status: "Review", payment: "Partial", retailerId: "R002" },
];

const INIT_RETAILERS = [
  { id: "R001", name: "Ravi Spices", email: "ravi@spices.in", phone: "9821002222", city: "Mumbai", status: "Active", joined: "2025-02-01", password: "ravi123", avatar: "RS", googleId: null },
  { id: "R002", name: "Arora Electronics", email: "arora@electronics.com", phone: "9822003333", city: "Delhi", status: "Active", joined: "2025-03-10", password: "arora123", avatar: "AE", googleId: null },
  { id: "R003", name: "Priya Boutique", email: "priya@boutique.in", phone: "9823004444", city: "Pune", status: "Pending", joined: "2025-04-01", password: "priya123", avatar: "PB", googleId: null },
];

const INIT_EMPLOYEES = [
  {
    id: "EMP001", name: "Aarav Sharma", role: "Business Dev Executive", dept: "Sales", email: "aarav@o2omarket.in", phone: "9870001111", status: "Active", joined: "2024-01-15",
    target: { proposals: 20, clients: 15, revenue: 500000 },
    achieved: { proposals: 18, clients: 13, revenue: 460000 },
    visits: [12, 18, 22, 15, 24, 19, 28, 31, 26, 22, 30, 35],
    messages: [{ from: "admin", text: "Great work this month, Aarav!", time: "2025-04-10 10:30", read: true }, { from: "admin", text: "Please follow up on PRO-002", time: "2025-04-12 14:15", read: false }]
  },
  {
    id: "EMP002", name: "Sneha Patel", role: "Digital Marketing Mgr", dept: "Marketing", email: "sneha@o2omarket.in", phone: "9870002222", status: "Active", joined: "2024-03-01",
    target: { proposals: 15, clients: 12, revenue: 350000 },
    achieved: { proposals: 15, clients: 14, revenue: 390000 },
    visits: [8, 14, 17, 20, 18, 22, 25, 28, 24, 19, 27, 30],
    messages: [{ from: "admin", text: "Campaign performance is excellent.", time: "2025-04-08 09:00", read: true }]
  },
  {
    id: "EMP003", name: "Rahul Mehta", role: "E-Commerce Manager", dept: "Operations", email: "rahul@o2omarket.in", phone: "9870003333", status: "Active", joined: "2024-06-10",
    target: { proposals: 10, clients: 8, revenue: 200000 },
    achieved: { proposals: 7, clients: 6, revenue: 145000 },
    visits: [5, 9, 11, 8, 13, 10, 14, 16, 12, 10, 15, 18],
    messages: []
  },
  {
    id: "EMP004", name: "Priya Nair", role: "Sales Executive", dept: "Sales", email: "priya.n@o2omarket.in", phone: "9870004444", status: "Active", joined: "2025-01-01",
    target: { proposals: 12, clients: 10, revenue: 280000 },
    achieved: { proposals: 11, clients: 9, revenue: 265000 },
    visits: [6, 10, 12, 14, 11, 16, 20, 22, 18, 15, 21, 24],
    messages: [{ from: "admin", text: "Welcome to the team!", time: "2025-01-02 09:00", read: true }]
  },
];

// Site visit data (last 12 months)
const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const SITE_VISITS = [340, 410, 380, 520, 490, 610, 580, 720, 695, 830, 780, 945];
const UNIQUE_VISITORS = [210, 260, 235, 320, 305, 390, 360, 450, 430, 520, 490, 610];

const MOCK_GOOGLE = [
  { googleId: "g001", name: "Priya Sharma", email: "priya.sharma@gmail.com", avatar: "PS", role: "retailer" },
  { googleId: "g002", name: "Vikram Mehta", email: "vikram.mehta@gmail.com", avatar: "VM", role: "retailer" },
  { googleId: "g003", name: "Admin User", email: "admin@o2omarket.in", avatar: "AU", role: "admin" },
  { googleId: "g004", name: "Sunita Kapoor", email: "sunita.kapoor@gmail.com", avatar: "SK", role: "retailer" },
];

const BIZ_TYPES = {
  salon: { icon: "💇", color: "#ec4899", label: "Salons" },
  school: { icon: "🏫", color: "#3b82f6", label: "Schools" },
  retail: { icon: "🛒", color: "#f59e0b", label: "Retail Shops" },
  gym: { icon: "🏋️", color: "#22c55e", label: "Gyms" },
  restaurant: { icon: "🍽️", color: "#f97316", label: "Restaurants" },
  pharmacy: { icon: "💊", color: "#a78bfa", label: "Pharmacies" },
  hotel: { icon: "🏨", color: "#06b6d4", label: "Hotels" },
  clinic: { icon: "🏥", color: "#ef4444", label: "Clinics" },
};
const CITY_DATA = [
  { city: "Mumbai", lat: 19.076, lng: 72.877, salon: 312, school: 198, retail: 876, gym: 145, restaurant: 543, pharmacy: 234, hotel: 87, clinic: 176 },
  { city: "Delhi", lat: 28.613, lng: 77.209, salon: 289, school: 312, retail: 1043, gym: 198, restaurant: 712, pharmacy: 312, hotel: 134, clinic: 245 },
  { city: "Bangalore", lat: 12.972, lng: 77.594, salon: 245, school: 187, retail: 654, gym: 213, restaurant: 498, pharmacy: 198, hotel: 76, clinic: 167 },
  { city: "Hyderabad", lat: 17.385, lng: 78.487, salon: 187, school: 156, retail: 532, gym: 134, restaurant: 389, pharmacy: 167, hotel: 54, clinic: 134 },
  { city: "Pune", lat: 18.520, lng: 73.856, salon: 156, school: 143, retail: 423, gym: 167, restaurant: 298, pharmacy: 134, hotel: 43, clinic: 112 },
  { city: "Chennai", lat: 13.083, lng: 80.270, salon: 178, school: 167, retail: 487, gym: 112, restaurant: 356, pharmacy: 145, hotel: 49, clinic: 123 },
  { city: "Kolkata", lat: 22.572, lng: 88.363, salon: 143, school: 198, retail: 534, gym: 89, restaurant: 412, pharmacy: 156, hotel: 62, clinic: 134 },
  { city: "Ahmedabad", lat: 23.023, lng: 72.571, salon: 134, school: 145, retail: 398, gym: 98, restaurant: 267, pharmacy: 123, hotel: 38, clinic: 98 },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const sColor = s => ({ Approved: "#22c55e", Pending: "#f59e0b", Review: "#3b82f6", Rejected: "#ef4444" }[s] || "#888");
const pColor = s => ({ Paid: "#22c55e", Unpaid: "#ef4444", Partial: "#f59e0b" }[s] || "#888");
const pct = (a, t) => t > 0 ? Math.min(100, Math.round(a / t * 100)) : 0;
const fmt = n => Number(n).toLocaleString("en-IN");

function useReveal(d = 0) { const ref = useRef(); const [v, setV] = useState(false); useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold: 0.1 }); if (ref.current) o.observe(ref.current); return () => o.disconnect(); }, []); return [ref, { opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(22px)", transition: `opacity .5s ${d}s ease,transform .5s ${d}s ease` }]; }
const R = ({ c, d = 0, s = {} }) => { const [ref, st] = useReveal(d); return <div ref={ref} style={{ ...st, ...s }}>{c}</div>; };

const StatCard = ({ icon, label, val, accent = "#c8f04a", sub }) => (
  <div style={{ background: "#13151c", border: "1px solid #1f2130", borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontSize: 20 }}>{icon}</span>
    <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 22, color: accent }}>{val}</span>
    <span style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".07em" }}>{label}</span>
    {sub && <span style={{ fontSize: 11, color: "#555" }}>{sub}</span>}
  </div>
);

const PctBar = ({ val, color = "#c8f04a", label }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
      <span style={{ color: "#e5e7eb" }}>{label}</span>
      <span style={{ color: val >= 100 ? "#22c55e" : val >= 70 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{val}%</span>
    </div>
    <div style={{ background: "#1c2128", borderRadius: 4, height: 7, overflow: "hidden" }}>
      <div style={{ height: "100%", borderRadius: 4, background: val >= 100 ? "#22c55e" : val >= 70 ? "#f59e0b" : "#ef4444", width: `${val}%`, transition: "width .6s ease" }} />
    </div>
  </div>
);

// ─── MINI CHART ─────────────────────────────────────────────────────────────────
const Sparkline = ({ data, color = "#c8f04a", height = 40 }) => {
  const mx = Math.max(...data); const mn = Math.min(...data);
  const pts = data.map((v, i) => { const x = i / (data.length - 1) * 200; const y = height - (v - mn) / (mx - mn || 1) * height; return `${x},${y}`; }).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 200 ${height}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <polygon points={`0,${height} ${pts} 200,${height}`} fill={color} fillOpacity=".12" />
    </svg>
  );
};

// ─── BAR CHART ──────────────────────────────────────────────────────────────────
const BarChart = ({ data, labels, color = "#c8f04a", height = 80 }) => {
  const mx = Math.max(...data) || 1;
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height, paddingTop: 8 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: "100%", background: color, borderRadius: "3px 3px 0 0", height: `${(v / mx) * height * 0.9}px`, opacity: .85, transition: "height .4s ease" }} />
          <span style={{ fontSize: 9, color: "#555", whiteSpace: "nowrap", transform: "rotate(-45deg)", transformOrigin: "top left", marginLeft: 4 }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ─── GOOGLE BUTTON ──────────────────────────────────────────────────────────────
const GoogleBtn = ({ onPick, label = "Continue with Google" }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#fff", color: "#1f2937", border: "1px solid #d1d5db", borderRadius: 8, padding: "11px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8h11.7C34.2 33.6 29.6 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.4 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.8 0 20.1-7.8 21.4-18.2.1-.9.1-1.9.1-2.8 0-.7 0-1.3-.1-2z" /><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 15.6 18.9 13 24 13c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.4 7.1 29.5 5 24 5 16.2 5 9.4 9.4 6.3 14.7z" /><path fill="#FBBC05" d="M24 45c5.4 0 10.3-1.9 14.1-5l-6.5-5.3C29.6 36.3 26.9 37 24 37c-5.6 0-10.2-3.4-11.7-8.1l-6.6 4.9C9.4 41.6 16.2 45 24 45z" /><path fill="#EA4335" d="M44.5 20H24v8h11.7c-.7 2.3-2.1 4.3-4 5.7l6.5 5.3C42 35.3 45 30.1 45 24c0-1.4-.1-2.7-.5-4z" /></svg>
        {label}
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#1a1d26", border: "1px solid #2a2d36", borderRadius: 12, overflow: "hidden", zIndex: 300, boxShadow: "0 16px 40px rgba(0,0,0,.7)" }}>
          <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid #2a2d36" }}><p style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", margin: 0 }}>Choose account</p></div>
          {MOCK_GOOGLE.map(a => (
            <button key={a.googleId} onClick={() => { setOpen(false); onPick(a); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#4285F4,#34A853)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{a.avatar}</div>
              <div style={{ flex: 1 }}><p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>{a.name}</p><p style={{ color: "#888", fontSize: 11, margin: 0 }}>{a.email}</p></div>
              {a.role === "admin" && <span style={{ background: "#2a1a0a", color: "#f97316", fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 700 }}>ADMIN</span>}
            </button>
          ))}
          <div style={{ padding: "6px 14px 10px", borderTop: "1px solid #2a2d36" }}><p style={{ color: "#555", fontSize: 11, textAlign: "center", margin: 0 }}>Demo accounts only</p></div>
        </div>
      )}
    </div>
  );
};

// ─── MARKET MAP ─────────────────────────────────────────────────────────────────
const MarketMap = () => {
  const mapRef = useRef(null); const leafRef = useRef(null); const markersRef = useRef([]);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    if (leafRef.current) return;
    const link = document.createElement("link"); link.rel = "stylesheet"; link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"; document.head.appendChild(link);
    const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    s.onload = () => { const L = window.L; const map = L.map(mapRef.current, { center: [20.5, 78.9], zoom: 5 }); leafRef.current = map; L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(map); addM(L, map, "all"); };
    document.head.appendChild(s);
  }, []);
  const addM = (L, map, f) => {
    markersRef.current.forEach(m => map.removeLayer(m)); markersRef.current = [];
    CITY_DATA.forEach(city => {
      const types = f === "all" ? Object.keys(BIZ_TYPES) : [f];
      const total = types.reduce((a, t) => a + (city[t] || 0), 0);
      const col = f === "all" ? "#c8f04a" : BIZ_TYPES[f].color;
      const r = Math.max(16, Math.min(42, total / 30));
      const icon = L.divIcon({ className: "", html: `<div style="width:${r * 2}px;height:${r * 2}px;background:${col};border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#0f1117;box-shadow:0 2px 12px rgba(0,0,0,.5)">${total > 999 ? Math.round(total / 1000) + "k" : total}</div>`, iconSize: [r * 2, r * 2], iconAnchor: [r, r] });
      const rows = types.map(t => `<div style="display:flex;justify-content:space-between;padding:2px 0"><span style="color:#888;font-size:12px">${BIZ_TYPES[t].icon} ${BIZ_TYPES[t].label}</span><span style="color:#c8f04a;font-weight:700;font-size:12px">${city[t] || 0}</span></div>`).join("");
      const m = L.marker([city.lat, city.lng], { icon }).addTo(map);
      m.bindPopup(`<div style="background:#13151c;padding:14px;min-width:200px;font-family:sans-serif;border-radius:8px"><div style="font-size:15px;font-weight:800;color:#fff;margin-bottom:10px">📍 ${city.city}</div>${rows}<div style="margin-top:8px;color:#c8f04a;font-weight:800;font-size:13px">Total: ${total}</div></div>`, { className: "cpop" });
      markersRef.current.push(m);
    });
  };
  const applyFilter = f => { setFilter(f); if (leafRef.current && window.L) addM(window.L, leafRef.current, f); };
  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <button onClick={() => applyFilter("all")} style={{ background: filter === "all" ? "#c8f04a" : "#13151c", color: filter === "all" ? "#0f1117" : "#888", border: "1px solid #1f2130", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontWeight: 700 }}>🗺️ All</button>
        {Object.entries(BIZ_TYPES).map(([k, v]) => (
          <button key={k} onClick={() => applyFilter(k)} style={{ background: filter === k ? v.color : "#13151c", color: filter === k ? "#0f1117" : "#888", border: `1px solid ${filter === k ? v.color : "#1f2130"}`, borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>{v.icon} {v.label}</button>
        ))}
      </div>
      <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #1f2130" }}><div ref={mapRef} style={{ height: 440, background: "#0f1117" }} /></div>
      <style>{`.cpop .leaflet-popup-content-wrapper{background:#13151c;border:1px solid #2a2d36;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,.6)}.cpop .leaflet-popup-tip{background:#13151c}.leaflet-popup-content{margin:0}`}</style>
    </div>
  );
};

// ─── AI AGENT ───────────────────────────────────────────────────────────────────
const AIAgent = ({ proposals, employees, retailers, siteVisits }) => {
  const [msgs, setMsgs] = useState([
    { role: "assistant", text: "👋 Hi! I'm your O2O Market AI Agent.\n\n• 📊 Check client visits & analytics\n• 👥 Review employee target progress\n• 📋 Manage proposals & payments\n• 🏪 Contact retailers & employees\n\n🔑 Enter your Anthropic API key below to enable live AI. Without it, I'll show smart demo answers!\n\nWhat would you like to do?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const buildContext = () => {
    const thisMonth = siteVisits[siteVisits.length - 1];
    const totalVisits = siteVisits.reduce((a, b) => a + b, 0);
    const empSummary = employees.map(e => `${e.name} (${e.role}): proposals ${e.achieved.proposals}/${e.target.proposals}, clients ${e.achieved.clients}/${e.target.clients}, revenue ₹${fmt(e.achieved.revenue)}/₹${fmt(e.target.revenue)}`).join("\n");
    const propSummary = `Total: ${proposals.length}, Approved: ${proposals.filter(p => p.status === "Approved").length}, Pending: ${proposals.filter(p => p.status === "Pending").length}, Paid: ${proposals.filter(p => p.payment === "Paid").length}`;
    return `You are the O2O Market AI Business Agent. Answer questions about the business data below. Be concise and use emojis.

LIVE DATA:
Site Visits This Month: ${thisMonth} | Total 12mo: ${totalVisits}
Proposals: ${propSummary}
Retailers: Total ${retailers.length}, Active ${retailers.filter(r => r.status === "Active").length}
Employees:\n${empSummary}
Recent proposals: ${proposals.slice(-3).map(p => `${p.id} ${p.client} - ${p.status} - ${p.payment}`).join("; ")}`;
  };

  const demoReply = (text) => {
    const t = text.toLowerCase();
    if (t.includes("visit") || t.includes("client")) return `📊 **Site Visit Summary**\n\nThis month: **${siteVisits[siteVisits.length - 1]} visits** — your best month so far!\n\nLast 3 months: ${siteVisits.slice(-3).join(" → ")}\n📈 Growth trend: +38% year-over-year\n\n💡 **Action:** Run a Google Ads campaign to push visits above 1,000/month.`;
    if (t.includes("target") || t.includes("employee")) return `🎯 **Employee Target Report**\n\n${employees.map(e => { const o = Math.round((pct(e.achieved.proposals, e.target.proposals) + pct(e.achieved.clients, e.target.clients) + pct(e.achieved.revenue, e.target.revenue)) / 3); return `${o >= 90 ? "✅" : o >= 60 ? "⚠️" : "🚨"} **${e.name}** — ${o}% overall`; }).join("\n")}\n\n💡 Rahul Mehta needs attention — only 67% overall.`;
    if (t.includes("proposal") || t.includes("pending")) return `📋 **Proposals Summary**\n\n${proposals.map(p => `• ${p.id} — ${p.client} | ${p.service} | ${p.status === "Pending" ? "⏳" : "✅"} ${p.status} | 💳 ${p.payment}`).join("\n")}\n\n💡 Follow up on PRO-002 (Ravi Spices) — pending for 30 days.`;
    if (t.includes("retailer")) return `🏪 **Retailer Status**\n\nActive: ${retailers.filter(r => r.status === "Active").length} | Pending: ${retailers.filter(r => r.status === "Pending").length}\n\n${retailers.map(r => `${r.status === "Active" ? "✅" : "⏳"} **${r.name}** — ${r.city} — ${r.status}`).join("\n")}\n\n💡 Priya Boutique is pending approval — review and activate.`;
    if (t.includes("message") || t.includes("draft")) return `✉️ **Draft Message for Retailers:**\n\n---\nDear [Name],\n\nHope you're doing well! We noticed your proposal is still under review. We'd love to help your business grow online.\n\nCan we schedule a quick 15-minute call this week?\n\nBest regards,\nO2O Market Team\n---\n\n💡 Personalize and send to: Ravi Spices, Arora Electronics`;
    if (t.includes("revenue")) return `💰 **Revenue Report**\n\n${employees.map(e => `• ${e.name}: ₹${fmt(e.achieved.revenue)} / ₹${fmt(e.target.revenue)} (${pct(e.achieved.revenue, e.target.revenue)}%)`).join("\n")}\n\n**Total Achieved:** ₹${fmt(employees.reduce((a, e) => a + e.achieved.revenue, 0))}\n**Total Target:** ₹${fmt(employees.reduce((a, e) => a + e.target.revenue, 0))}\n\n💡 Sneha Patel has exceeded her revenue target — great work!`;
    return `🤖 I understand you're asking about: "${text}"\n\nHere's what I can see from your business data:\n• ${proposals.length} total proposals (${proposals.filter(p => p.status === "Approved").length} approved)\n• ${siteVisits[siteVisits.length - 1]} site visits this month\n• ${employees.length} employees tracked\n\n💡 Add your Anthropic API key above for full AI-powered responses!`;
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    setMsgs(prev => [...prev, { role: "user", text }]);
    setInput(""); setLoading(true);
    if (!apiKey.trim()) {
      await new Promise(r => setTimeout(r, 700));
      setMsgs(prev => [...prev, { role: "assistant", text: demoReply(text) }]);
      setLoading(false); return;
    }
    try {
      const history = msgs.slice(1).map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: buildContext(), messages: [...history, { role: "user", content: text }] })
      });
      const data = await res.json();
      if (data.error) { setMsgs(prev => [...prev, { role: "assistant", text: `⚠️ API Error: ${data.error.message}\n\nCheck your API key and try again.` }]); }
      else { const reply = data.content?.map(c => c.text || "").join("") || "No response."; setMsgs(prev => [...prev, { role: "assistant", text: reply }]); }
    } catch (e) {
      setMsgs(prev => [...prev, { role: "assistant", text: "⚠️ Network error. Showing demo response instead:\n\n" + demoReply(text) }]);
    }
    setLoading(false);
  };

  const quickPrompts = [
    { icon: "📊", label: "Site visits", q: "How many clients visited our site this month?" },
    { icon: "🎯", label: "Targets", q: "Which employees completed their targets? Who needs attention?" },
    { icon: "📋", label: "Pending proposals", q: "List pending proposals and who to follow up on urgently." },
    { icon: "🏪", label: "Retailers", q: "Give me a retailer status summary." },
    { icon: "✉️", label: "Draft message", q: "Draft a follow-up message to send to retailers with pending proposals." },
    { icon: "📈", label: "Revenue", q: "Give me a revenue performance report across all employees." },
    { icon: "⚠️", label: "At-risk deals", q: "Which proposals are at risk? What actions should I take?" },
    { icon: "👋", label: "Motivate team", q: "Draft a motivational message for employees behind on targets." },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)", minHeight: 500 }}>
      {/* API Key input */}
      <div style={{ background: "#13151c", border: "1px solid #2a2050", borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "#a78bfa", whiteSpace: "nowrap" }}>🔑 Anthropic API Key:</span>
        <input type={showKey ? "text" : "password"} value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-ant-... (optional — works without it in demo mode)" style={{ flex: 1, minWidth: 200, background: "#0f1117", border: "1px solid #2a2d36", borderRadius: 6, padding: "6px 10px", color: "#fff", fontSize: 12, fontFamily: "inherit", outline: "none" }} />
        <button onClick={() => setShowKey(!showKey)} style={{ background: "none", border: "1px solid #333", color: "#888", borderRadius: 6, padding: "5px 10px", fontSize: 11, cursor: "pointer" }}>{showKey ? "Hide" : "Show"}</button>
        {apiKey ? <span style={{ fontSize: 11, color: "#22c55e" }}>✓ Key set</span> : <span style={{ fontSize: 11, color: "#f59e0b" }}>Demo mode</span>}
      </div>
      {/* Quick Actions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {quickPrompts.map(q => (
          <button key={q.label} onClick={() => sendMessage(q.q)} style={{ background: "#13151c", border: "1px solid #1f2130", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#c8f04a", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit" }}>
            <span>{q.icon}</span><span style={{ color: "#aaa" }}>{q.label}</span>
          </button>
        ))}
      </div>
      {/* Chat window */}
      <div style={{ flex: 1, overflowY: "auto", background: "#0a0c12", borderRadius: 14, border: "1px solid #1f2130", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: m.role === "user" ? "linear-gradient(135deg,#c8f04a,#84cc16)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
              {m.role === "user" ? "👤" : "🤖"}
            </div>
            <div style={{ maxWidth: "78%", background: m.role === "user" ? "#1a2810" : "#13151c", border: `1px solid ${m.role === "user" ? "#2a4020" : "#1f2130"}`, borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px", padding: "12px 14px", whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.65, color: m.role === "user" ? "#d4f090" : "#e5e7eb" }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div style={{ background: "#13151c", border: "1px solid #1f2130", borderRadius: "4px 14px 14px 14px", padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 4 }}>{[0, .2, .4].map((d, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", animation: `bounce .8s ${d}s infinite` }} />)}</div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {/* Input */}
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)} placeholder="Ask anything — targets, visits, retailer status, draft a message..." style={{ flex: 1, background: "#13151c", border: "1px solid #2a2d36", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} style={{ background: loading || !input.trim() ? "#1f2130" : "#c8f04a", color: loading || !input.trim() ? "#555" : "#0f1117", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontFamily: "inherit" }}>Send →</button>
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
    </div>
  );
};

// ─── EMPLOYEE MANAGER ───────────────────────────────────────────────────────────
const EmployeeManager = ({ employees, setEmployees, proposals }) => {
  const [tab, setTab] = useState("overview");
  const [selected, setSelected] = useState(null);
  const [msgText, setMsgText] = useState("");
  const [msgSent, setMsgSent] = useState(false);

  const sendMsg = (empId) => {
    if (!msgText.trim()) return;
    setEmployees(prev => prev.map(e => e.id === empId ? { ...e, messages: [...e.messages, { from: "admin", text: msgText, time: new Date().toLocaleString(), read: false }] } : e));
    setMsgText(""); setMsgSent(true); setTimeout(() => setMsgSent(false), 2000);
  };

  const emp = selected ? employees.find(e => e.id === selected) : null;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", borderBottom: "1px solid #1f2130", paddingBottom: 12 }}>
        {[["overview", "👥 Overview"], ["targets", "🎯 Targets"], ["visits", "📈 Visits"], ["messages", "✉️ Messages"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? "#c8f04a" : "#13151c", color: tab === t ? "#0f1117" : "#888", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", fontWeight: tab === t ? 700 : 400, fontFamily: "inherit" }}>{l}</button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {employees.map(e => {
            const pp = pct(e.achieved.proposals, e.target.proposals);
            const cp = pct(e.achieved.clients, e.target.clients);
            const rp = pct(e.achieved.revenue, e.target.revenue);
            const overall = Math.round((pp + cp + rp) / 3);
            return (
              <div key={e.id} style={{ background: "#13151c", border: `1px solid ${overall >= 90 ? "#22c55e" : overall >= 60 ? "#f59e0b" : "#ef4444"}`, borderRadius: 14, padding: 20, cursor: "pointer" }} onClick={() => { setSelected(selected === e.id ? null : e.id); setTab("targets"); }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#c8f04a,#84cc16)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1117", fontSize: 16, fontWeight: 800 }}>{e.name.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: "0 0 2px" }}>{e.name}</p>
                    <p style={{ color: "#888", fontSize: 12, margin: 0 }}>{e.role} · {e.dept}</p>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: overall >= 90 ? "#0d2010" : overall >= 60 ? "#1a1710" : "#1a0d0d", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 14, color: overall >= 90 ? "#22c55e" : overall >= 60 ? "#f59e0b" : "#ef4444" }}>{overall}%</span>
                  </div>
                </div>
                <PctBar val={pp} label={`Proposals ${e.achieved.proposals}/${e.target.proposals}`} />
                <PctBar val={cp} label={`Clients ${e.achieved.clients}/${e.target.clients}`} />
                <PctBar val={rp} label={`Revenue ₹${fmt(e.achieved.revenue)}/₹${fmt(e.target.revenue)}`} />
                {e.messages.filter(m => !m.read).length > 0 && <div style={{ marginTop: 8, background: "#1a1d26", borderRadius: 6, padding: "4px 10px", display: "inline-block", fontSize: 11, color: "#f59e0b" }}>{e.messages.filter(m => !m.read).length} unread message(s)</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Targets ── */}
      {tab === "targets" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 20 }}>
            <StatCard icon="✅" label="On Target (≥90%)" val={employees.filter(e => Math.round((pct(e.achieved.proposals, e.target.proposals) + pct(e.achieved.clients, e.target.clients) + pct(e.achieved.revenue, e.target.revenue)) / 3) >= 90).length} accent="#22c55e" />
            <StatCard icon="⚠️" label="At Risk (60–89%)" val={employees.filter(e => { const o = Math.round((pct(e.achieved.proposals, e.target.proposals) + pct(e.achieved.clients, e.target.clients) + pct(e.achieved.revenue, e.target.revenue)) / 3); return o >= 60 && o < 90; }).length} accent="#f59e0b" />
            <StatCard icon="🚨" label="Behind (<60%)" val={employees.filter(e => Math.round((pct(e.achieved.proposals, e.target.proposals) + pct(e.achieved.clients, e.target.clients) + pct(e.achieved.revenue, e.target.revenue)) / 3) < 60).length} accent="#ef4444" />
            <StatCard icon="👥" label="Total Employees" val={employees.length} accent="#c8f04a" />
          </div>
          <div style={{ overflowX: "auto", border: "1px solid #1f2130", borderRadius: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "inherit" }}>
              <thead><tr style={{ background: "#1a1d26" }}>
                {["Employee", "Role", "Proposals", "Clients", "Revenue", "Overall", "Action"].map(h => <th key={h} style={TS.th}>{h}</th>)}
              </tr></thead>
              <tbody>{employees.map((e, i) => {
                const pp = pct(e.achieved.proposals, e.target.proposals);
                const cp = pct(e.achieved.clients, e.target.clients);
                const rp = pct(e.achieved.revenue, e.target.revenue);
                const overall = Math.round((pp + cp + rp) / 3);
                const oc = overall >= 90 ? "#22c55e" : overall >= 60 ? "#f59e0b" : "#ef4444";
                return (
                  <tr key={e.id} style={{ background: i % 2 === 0 ? "#13151c" : "#0f1117" }}>
                    <td style={TS.td}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#c8f04a,#84cc16)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1117", fontSize: 12, fontWeight: 700 }}>{e.name.charAt(0)}</div><span style={{ fontWeight: 600, color: "#e5e7eb" }}>{e.name}</span></div></td>
                    <td style={{ ...TS.td, color: "#888", fontSize: 11 }}>{e.role}</td>
                    <td style={TS.td}><span style={{ color: pp >= 100 ? "#22c55e" : pp >= 70 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{pp}%</span> <span style={{ color: "#555", fontSize: 10 }}>{e.achieved.proposals}/{e.target.proposals}</span></td>
                    <td style={TS.td}><span style={{ color: cp >= 100 ? "#22c55e" : cp >= 70 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{cp}%</span> <span style={{ color: "#555", fontSize: 10 }}>{e.achieved.clients}/{e.target.clients}</span></td>
                    <td style={TS.td}><span style={{ color: rp >= 100 ? "#22c55e" : rp >= 70 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{rp}%</span> <span style={{ color: "#555", fontSize: 10 }}>₹{fmt(e.achieved.revenue)}</span></td>
                    <td style={TS.td}><span style={{ background: oc + "22", color: oc, padding: "3px 10px", borderRadius: 6, fontWeight: 700, fontSize: 12 }}>● {overall}%</span></td>
                    <td style={TS.td}><button onClick={() => { setSelected(e.id); setTab("messages"); }} style={{ background: "#1a1d26", border: "1px solid #2a2d36", color: "#c8f04a", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>Message</button></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Visits ── */}
      {tab === "visits" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 20 }}>
            <StatCard icon="👁️" label="Site Visits (Apr)" val={SITE_VISITS[SITE_VISITS.length - 1].toLocaleString()} accent="#c8f04a" />
            <StatCard icon="🧑" label="Unique Visitors" val={UNIQUE_VISITORS[UNIQUE_VISITORS.length - 1].toLocaleString()} accent="#60a5fa" />
            <StatCard icon="📈" label="YoY Growth" val="+38%" accent="#22c55e" />
            <StatCard icon="⏱️" label="Avg Session" val="3m 42s" accent="#a78bfa" />
          </div>
          <div style={{ background: "#13151c", border: "1px solid #1f2130", borderRadius: 14, padding: 20, marginBottom: 16 }}>
            <h3 style={{ color: "#fff", fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Monthly Site Visits</h3>
            <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 14 }}>Total visits vs unique visitors — last 12 months</p>
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#c8f04a", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 24, height: 3, background: "#c8f04a", display: "inline-block", borderRadius: 2 }} /> Total Visits</span>
              <span style={{ fontSize: 11, color: "#60a5fa", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 24, height: 3, background: "#60a5fa", display: "inline-block", borderRadius: 2, opacity: .6 }} /> Unique Visitors</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
              <Sparkline data={SITE_VISITS} color="#c8f04a" height={70} />
            </div>
            <div style={{ marginTop: 16 }}><BarChart data={SITE_VISITS} labels={MONTHS} color="#c8f04a" height={100} /></div>
          </div>
          {/* Per employee visits */}
          <h3 style={{ color: "#fff", fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Client Visits Generated by Employee</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
            {employees.map(e => (
              <div key={e.id} style={{ background: "#13151c", border: "1px solid #1f2130", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <p style={{ color: "#fff", fontWeight: 600, fontSize: 13, margin: 0 }}>{e.name}</p>
                    <p style={{ color: "#888", fontSize: 11, margin: 0 }}>{e.dept}</p>
                  </div>
                  <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, color: "#c8f04a" }}>{e.visits[e.visits.length - 1]}</span>
                </div>
                <Sparkline data={e.visits} color="#c8f04a" height={36} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#555" }}>
                  <span>Total: {e.visits.reduce((a, b) => a + b, 0)}</span>
                  <span>Avg/mo: {Math.round(e.visits.reduce((a, b) => a + b, 0) / e.visits.length)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      {tab === "messages" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(220px,280px) 1fr", gap: 16, minHeight: 400 }}>
          {/* Employee list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {employees.map(e => (
              <button key={e.id} onClick={() => setSelected(selected === e.id ? null : e.id)} style={{ background: selected === e.id ? "#1a2810" : "#13151c", border: `1px solid ${selected === e.id ? "#c8f04a" : "#1f2130"}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#c8f04a,#84cc16)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1117", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{e.name.charAt(0)}</div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.name}</p>
                  <p style={{ color: "#888", fontSize: 11, margin: 0 }}>{e.dept}</p>
                </div>
                {e.messages.filter(m => !m.read).length > 0 && <span style={{ background: "#ef4444", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{e.messages.filter(m => !m.read).length}</span>}
              </button>
            ))}
          </div>
          {/* Conversation */}
          <div style={{ background: "#0a0c12", border: "1px solid #1f2130", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            {!selected ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#555", fontSize: 14 }}>← Select an employee to message</div>
            ) : (() => {
              const e = employees.find(x => x.id === selected);
              if (!e) return null;
              return (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 12, borderBottom: "1px solid #1f2130" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#c8f04a,#84cc16)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1117", fontSize: 14, fontWeight: 700 }}>{e.name.charAt(0)}</div>
                    <div><p style={{ color: "#fff", fontWeight: 600, fontSize: 14, margin: 0 }}>{e.name}</p><p style={{ color: "#888", fontSize: 11, margin: 0 }}>{e.email}</p></div>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, maxHeight: 280 }}>
                    {e.messages.length === 0 && <p style={{ color: "#555", fontSize: 13, textAlign: "center", marginTop: 20 }}>No messages yet.</p>}
                    {e.messages.map((m, i) => (
                      <div key={i} style={{ alignSelf: m.from === "admin" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                        <div style={{ background: m.from === "admin" ? "#1a2810" : "#13151c", border: `1px solid ${m.from === "admin" ? "#2a4020" : "#1f2130"}`, borderRadius: 10, padding: "8px 12px", fontSize: 13, color: m.from === "admin" ? "#d4f090" : "#e5e7eb" }}>{m.text}</div>
                        <p style={{ color: "#555", fontSize: 10, margin: "3px 4px 0", textAlign: m.from === "admin" ? "right" : "left" }}>{m.time}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid #1f2130" }}>
                    <input value={msgText} onChange={x => setMsgText(x.target.value)} onKeyDown={x => x.key === "Enter" && sendMsg(selected)} placeholder={`Message ${e.name}...`} style={{ flex: 1, background: "#13151c", border: "1px solid #2a2d36", borderRadius: 8, padding: "9px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                    <button onClick={() => sendMsg(selected)} style={{ background: "#c8f04a", color: "#0f1117", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Send</button>
                  </div>
                  {msgSent && <p style={{ color: "#22c55e", fontSize: 12, margin: 0 }}>✓ Message sent!</p>}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [mob, setMob] = useState(false);
  const [proposals, setProposals] = useState(INIT_PROPOSALS);
  const [retailers, setRetailers] = useState(INIT_RETAILERS);
  const [employees, setEmployees] = useState(INIT_EMPLOYEES);
  const [careerApps, setCareerApps] = useState([{ id: "CA-001", jobTitle: "Digital Marketing Specialist", name: "Anjali Sharma", email: "anjali@gmail.com", msg: "3 years in digital marketing.", date: "2025-03-15", status: "Shortlisted" }]);
  const [form, setForm] = useState({ client: "", email: "", phone: "", service: "Online Store Setup", budget: "", timeline: "", description: "", payment: "Unpaid" });
  const [formSent, setFormSent] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", msg: "" });
  const [contactSent, setContactSent] = useState(false);
  const [career, setCareer] = useState({ name: "", email: "", msg: "" });
  const [careerSent, setCareerSent] = useState(false);
  const [selJob, setSelJob] = useState(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ user: "", pass: "" });
  const [adminErr, setAdminErr] = useState("");
  const [adminTab, setAdminTab] = useState("dashboard");
  const [retailerAuth, setRetailerAuth] = useState(null);
  const [rMode, setRMode] = useState("login");
  const [rLogin, setRLogin] = useState({ email: "", pass: "" });
  const [rReg, setRReg] = useState({ name: "", email: "", phone: "", city: "", gst: "", pass: "" });
  const [rErr, setRErr] = useState("");
  const [rTab, setRTab] = useState("dashboard");
  const [rProp, setRProp] = useState({ service: "Online Store Setup", budget: "", timeline: "", description: "" });
  const [rPropSent, setRPropSent] = useState(false);
  // Retailer messaging
  const [retMsgTarget, setRetMsgTarget] = useState(null);
  const [retMsgText, setRetMsgText] = useState("");
  const [retMsgs, setRetMsgs] = useState({});

  const nav = p => { setPage(p); setMob(false); window.scrollTo(0, 0); };

  const handleGooglePick = (acc, target) => {
    if (target === "admin") {
      if (acc.role === "admin" || acc.email === "admin@o2omarket.in") { setAdminAuth(true); setAdminErr(""); }
      else setAdminErr(`${acc.name} is not an admin account.`);
    } else {
      let found = retailers.find(r => r.googleId === acc.googleId || r.email === acc.email);
      if (!found) { const id = "R" + String(retailers.length + 1).padStart(3, "0"); found = { id, name: acc.name, email: acc.email, phone: "", city: "", gst: "", status: "Active", joined: new Date().toISOString().split("T")[0], avatar: acc.avatar, googleId: acc.googleId, password: "" }; setRetailers(prev => [...prev, found]); }
      setRetailerAuth(found); setRErr("");
    }
  };

  const addProposal = () => {
    if (!form.client || !form.email) return;
    const nr = { id: `PRO-${String(proposals.length + 1).padStart(3, "0")}`, date: new Date().toISOString().split("T")[0], client: form.client, email: form.email, phone: form.phone, service: form.service, budget: form.budget, timeline: form.timeline, status: "Pending", payment: form.payment, retailerId: null };
    setProposals(p => [...p, nr]); setFormSent(true); setForm({ client: "", email: "", phone: "", service: "Online Store Setup", budget: "", timeline: "", description: "", payment: "Unpaid" }); setTimeout(() => setFormSent(false), 3000);
  };

  const retailerPropSubmit = () => {
    if (!retailerAuth || !rProp.budget) return;
    const nr = { id: `PRO-${String(proposals.length + 1).padStart(3, "0")}`, date: new Date().toISOString().split("T")[0], client: retailerAuth.name, email: retailerAuth.email, phone: retailerAuth.phone || "", service: rProp.service, budget: rProp.budget, timeline: rProp.timeline, status: "Pending", payment: "Unpaid", retailerId: retailerAuth.id };
    setProposals(p => [...p, nr]); setRPropSent(true); setRProp({ service: "Online Store Setup", budget: "", timeline: "", description: "" }); setTimeout(() => setRPropSent(false), 3000);
  };

  const exportCSV = (data, fn) => {
    const keys = Object.keys(data[0]);
    const csv = [keys, ...data.map(r => keys.map(k => `"${r[k] || ""}"`))].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = fn; a.click();
  };

  const sendRetailerMsg = (rid) => {
    if (!retMsgText.trim()) return;
    setRetMsgs(prev => ({ ...prev, [rid]: [...(prev[rid] || []), { from: "admin", text: retMsgText, time: new Date().toLocaleTimeString() }] }));
    setRetMsgText("");
  };

  const myProps = retailerAuth ? proposals.filter(p => p.retailerId === retailerAuth.id) : [];
  const S = ST;

  return (
    <div style={S.root}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet" />

      {/* ══ NAV ══ */}
      <nav style={S.nav}>
        <div style={S.navWrap}>
          <div style={S.logo} onClick={() => nav("home")}>
            <span style={S.logoMark}>O2O</span><span style={S.logoText}>Market</span>
          </div>
          <div style={{ ...S.navLinks, ...(mob ? { display: "flex", flexDirection: "column", position: "absolute", top: 60, left: 0, right: 0, background: "#0f1117", padding: 20, borderBottom: "1px solid #1a1d26", zIndex: 99 } : {}) }}>
            {[["home", "Home"], ["proposals", "Proposals"], ["market-map", "🗺️ Map"], ["contact", "Contact"], ["careers", "Careers"]].map(([p, l]) => (
              <button key={p} onClick={() => nav(p)} style={{ ...S.navBtn, ...(page === p ? S.navActive : {}) }}>{l}</button>
            ))}
            <button onClick={() => nav("retailer")} style={{ ...S.navBtn, ...(page === "retailer" ? S.navActive : {}), color: "#60a5fa" }}>🏪 Retailer</button>
            <button onClick={() => nav("admin")} style={{ ...S.navBtn, ...(page === "admin" ? S.navActive : {}), color: "#f97316" }}>🔐 Admin</button>
            <button onClick={() => nav("agent")} style={{ ...S.navBtn, ...(page === "agent" ? S.navActive : {}), background: page === "agent" ? "#6366f1" : "transparent", color: page === "agent" ? "#fff" : "#a78bfa", border: page === "agent" ? "none" : "1px solid #3d3d6b", borderRadius: 8 }}>🤖 AI Agent</button>
            <button onClick={() => nav("proposals")} style={S.pill}>Get Started →</button>
          </div>
          <button style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }} onClick={() => setMob(!mob)}>{mob ? "✕" : "☰"}</button>
        </div>
      </nav>

      {/* ═══ HOME ═══ */}
      {page === "home" && (
        <div>
          <section style={S.hero}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%,#1a2a0a 0%,#0f1117 70%)" }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#1f2130 1px,transparent 1px),linear-gradient(90deg,#1f2130 1px,transparent 1px)", backgroundSize: "40px 40px", opacity: .28 }} />
            <div style={S.heroInner}>
              <R c={<span style={S.badge}>🚀 Offline → Online Specialists</span>} />
              <R d={.1} c={<h1 style={S.h1}>Take Your Business<br /><span style={{ color: "#c8f04a" }}>Online Today</span></h1>} />
              <R d={.2} c={<p style={S.heroP}>We transform brick-and-mortar businesses into thriving digital brands. Powered by an AI agent that tracks visits, targets, and team performance.</p>} />
              <R d={.3} s={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }} c={<>
                <button onClick={() => nav("proposals")} style={S.pill}>Submit a Proposal →</button>
                <button onClick={() => nav("agent")} style={{ ...S.ghost, color: "#a78bfa", borderColor: "#3d3d6b" }}>🤖 Talk to AI Agent</button>
                <button onClick={() => nav("market-map")} style={S.ghost}>🗺️ Market Map</button>
              </>} />
              <R d={.4} c={
                <div style={{ display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap", marginTop: 40, paddingTop: 40, borderTop: "1px solid #1f2130" }}>
                  {[["500+", "Businesses"], ["₹12Cr+", "Revenue"], [SITE_VISITS[SITE_VISITS.length - 1], "Visits/mo"], ["12", "Cities"]].map(([n, l]) => (
                    <div key={l} style={{ padding: "10px 28px", borderRight: "1px solid #1f2130", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 26, color: "#c8f04a" }}>{n}</span>
                      <span style={{ fontSize: 12, color: "#6b7280" }}>{l}</span>
                    </div>
                  ))}
                </div>
              } />
            </div>
          </section>
          {/* AI Agent CTA strip */}
          <div style={{ background: "linear-gradient(135deg,#1a1430,#0f1117)", borderTop: "1px solid #2a2050", borderBottom: "1px solid #2a2050", padding: "32px 24px", textAlign: "center" }}>
            <R c={<div style={{ maxWidth: 700, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
                <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(18px,3vw,28px)", color: "#fff", margin: 0 }}>Meet Your AI Business Agent</h2>
              </div>
              <p style={{ color: "#9ca3af", fontSize: 15, marginBottom: 18 }}>Track site visits, employee targets, retailer contacts — ask anything in plain English.</p>
              <button onClick={() => nav("agent")} style={{ ...S.pill, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff" }}>Open AI Agent →</button>
            </div>} />
          </div>
          <section style={S.sec}>
            <R c={<p style={S.secTag}>What We Do</p>} />
            <R d={.05} c={<h2 style={S.h2}>Everything You Need to Go Digital</h2>} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
              {SERVICES.map((sv, i) => (
                <R key={sv.title} d={i * .06} c={<div style={S.card}><span style={{ fontSize: 24, display: "block", marginBottom: 10 }}>{sv.icon}</span><h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>{sv.title}</h3><p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{sv.desc}</p></div>} />
              ))}
            </div>
          </section>
          <section style={{ background: "#c8f04a", padding: "52px 24px", textAlign: "center" }}>
            <R c={<h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(22px,4vw,36px)", color: "#0f1117", marginBottom: 8 }}>Ready to go online?</h2>} />
            <R d={.1} c={<p style={{ color: "#374151", marginBottom: 22 }}>Free proposal — our AI agent will follow up.</p>} />
            <R d={.2} c={<button onClick={() => nav("proposals")} style={{ ...S.pill, background: "#0f1117", color: "#c8f04a" }}>Submit Proposal →</button>} />
          </section>
        </div>
      )}

      {/* ═══ AI AGENT ═══ */}
      {page === "agent" && (
        <div style={S.page}>
          <R c={<div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <div style={{ width: 52, height: 52, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🤖</div>
            <div><h1 style={{ ...S.pageH1, marginBottom: 2 }}>AI Business Agent</h1><p style={{ color: "#a78bfa", fontSize: 14 }}>Powered by Claude · Knows your business in real-time</p></div>
          </div>} />
          <R d={.08} c={
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 20 }}>
              <StatCard icon="👁️" label="Visits This Month" val={SITE_VISITS[SITE_VISITS.length - 1]} accent="#c8f04a" />
              <StatCard icon="📋" label="Total Proposals" val={proposals.length} accent="#60a5fa" />
              <StatCard icon="👥" label="Employees" val={employees.length} accent="#22c55e" />
              <StatCard icon="🏪" label="Active Retailers" val={retailers.filter(r => r.status === "Active").length} accent="#f59e0b" />
              <StatCard icon="✅" label="On Target" val={`${employees.filter(e => Math.round((pct(e.achieved.proposals, e.target.proposals) + pct(e.achieved.clients, e.target.clients) + pct(e.achieved.revenue, e.target.revenue)) / 3) >= 80).length}/${employees.length}`} accent="#a78bfa" />
            </div>
          } />
          <AIAgent proposals={proposals} employees={employees} retailers={retailers} siteVisits={SITE_VISITS} onNav={nav} />
        </div>
      )}

      {/* ═══ PROPOSALS ═══ */}
      {page === "proposals" && (
        <div style={S.page}>
          <R c={<h1 style={S.pageH1}>Proposals</h1>} />
          <R d={.05} c={<p style={S.pageP}>Submit a proposal — synced to Google Sheets format.</p>} />
          <R d={.1} c={
            <div style={{ ...S.panel, marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #1f2130" }}>
                <div style={{ display: "flex", gap: 5 }}>{["#ef4444", "#f59e0b", "#22c55e"].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />)}</div>
                <span style={{ fontFamily: "Syne", fontWeight: 600, fontSize: 13, color: "#fff" }}>New Proposal — Google Sheets Format</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
                {[["Client Name", "text", "client"], ["Email", "email", "email"], ["Phone", "tel", "phone"], ["Budget", "text", "budget"], ["Timeline", "text", "timeline"]].map(([l, t, k]) => (
                  <div key={k}><label style={S.lbl}>{l}</label><input type={t} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} style={S.inp} placeholder={l} /></div>
                ))}
                <div><label style={S.lbl}>Service</label><select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} style={S.inp}>{SERVICES.map(s => <option key={s.title}>{s.title}</option>)}</select></div>
                <div><label style={S.lbl}>Payment</label><select value={form.payment} onChange={e => setForm({ ...form, payment: e.target.value })} style={S.inp}><option>Unpaid</option><option>Partial</option><option>Paid</option></select></div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={addProposal} style={S.pill}>＋ Add to Sheet</button>
                <button onClick={() => exportCSV(proposals, "proposals.csv")} style={S.ghost}>⬇ Export CSV</button>
                {formSent && <span style={{ color: "#22c55e", fontSize: 13 }}>✓ Added!</span>}
              </div>
            </div>
          } />
          <R d={.15} c={
            <div style={{ marginTop: 24, overflowX: "auto", border: "1px solid #1f2130", borderRadius: 12 }}>
              <table style={S.tbl}><thead><tr style={{ background: "#1a1d26" }}>{["ID", "Date", "Client", "Service", "Budget", "Status", "Payment", "Del"].map(h => <th key={h} style={TS.th}>{h}</th>)}</tr></thead>
                <tbody>{proposals.map((p, i) => (
                  <tr key={p.id} style={{ background: i % 2 === 0 ? "#13151c" : "#0f1117" }}>
                    <td style={TS.td}><span style={{ color: "#c8f04a", fontFamily: "monospace", fontSize: 11 }}>{p.id}</span></td>
                    <td style={{ ...TS.td, fontSize: 11, color: "#888" }}>{p.date}</td>
                    <td style={{ ...TS.td, fontWeight: 600 }}>{p.client}</td>
                    <td style={{ ...TS.td, fontSize: 12 }}>{p.service}</td>
                    <td style={{ ...TS.td, color: "#c8f04a" }}>{p.budget}</td>
                    <td style={TS.td}><select value={p.status} onChange={e => setProposals(proposals.map(x => x.id === p.id ? { ...x, status: e.target.value } : x))} style={{ background: "transparent", border: `1px solid ${sColor(p.status)}`, color: sColor(p.status), borderRadius: 6, padding: "2px 5px", fontSize: 11, cursor: "pointer" }}><option>Pending</option><option>Review</option><option>Approved</option><option>Rejected</option></select></td>
                    <td style={TS.td}><select value={p.payment} onChange={e => setProposals(proposals.map(x => x.id === p.id ? { ...x, payment: e.target.value } : x))} style={{ background: "transparent", border: `1px solid ${pColor(p.payment)}`, color: pColor(p.payment), borderRadius: 6, padding: "2px 5px", fontSize: 11, cursor: "pointer" }}><option>Unpaid</option><option>Partial</option><option>Paid</option></select></td>
                    <td style={TS.td}><button onClick={() => setProposals(proposals.filter(x => x.id !== p.id))} style={{ background: "transparent", border: "1px solid #333", color: "#ef4444", borderRadius: 6, padding: "2px 7px", fontSize: 11, cursor: "pointer" }}>✕</button></td>
                  </tr>
                ))}</tbody></table>
            </div>
          } />
        </div>
      )}

      {/* ═══ MAP ═══ */}
      {page === "market-map" && (
        <div style={S.page}>
          <R c={<h1 style={S.pageH1}>🗺️ Offline Market Map</h1>} />
          <R d={.05} c={<p style={S.pageP}>Live view of offline businesses across India — click any city bubble for breakdown.</p>} />
          <R d={.1} c={<div style={{ marginTop: 20 }}><MarketMap /></div>} />
        </div>
      )}

      {/* ═══ CONTACT ═══ */}
      {page === "contact" && (
        <div style={S.page}>
          <R c={<h1 style={S.pageH1}>Contact Us</h1>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginTop: 24 }}>
            <R d={.1} c={
              <div style={S.panel}>
                <h3 style={{ color: "#fff", fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Send a Message</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[["Name", "text", "name"], ["Email", "email", "email"], ["Phone", "tel", "phone"]].map(([l, t, k]) => (
                    <div key={k}><label style={S.lbl}>{l}</label><input type={t} value={contact[k]} onChange={e => setContact({ ...contact, [k]: e.target.value })} style={S.inp} placeholder={l} /></div>
                  ))}
                  <div><label style={S.lbl}>Message</label><textarea value={contact.msg} onChange={e => setContact({ ...contact, msg: e.target.value })} style={{ ...S.inp, height: 90, resize: "vertical" }} placeholder="How can we help?" /></div>
                  <button onClick={() => { setContactSent(true); setContact({ name: "", email: "", phone: "", msg: "" }); setTimeout(() => setContactSent(false), 3000); }} style={S.pill}>Send →</button>
                  {contactSent && <span style={{ color: "#22c55e", fontSize: 13 }}>✓ Sent!</span>}
                </div>
              </div>
            } />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["📍", "Address", "304 Commerce House, Andheri West, Mumbai 400053"], ["📞", "Phone", "+91 98200 12345"], ["✉️", "Email", "hello@o2omarket.in"], ["⏰", "Hours", "Mon–Sat, 10am–7pm IST"]].map(([icon, l, v], i) => (
                <R key={l} d={.1 + i * .06} c={<div style={{ ...S.panel, display: "flex", gap: 12, padding: "14px 16px" }}><span style={{ fontSize: 20 }}>{icon}</span><div><div style={{ fontSize: 10, color: "#888", marginBottom: 2, textTransform: "uppercase", letterSpacing: ".06em" }}>{l}</div><div style={{ color: "#e5e7eb", fontSize: 13 }}>{v}</div></div></div>} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ CAREERS ═══ */}
      {page === "careers" && (
        <div style={S.page}>
          <R c={<h1 style={S.pageH1}>Careers</h1>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 14, marginTop: 24 }}>
            {JOBS.map((job, i) => (
              <R key={job.id} d={i * .06} c={
                <div style={{ ...S.card, cursor: "pointer", border: selJob === job.id ? "1px solid #c8f04a" : "1px solid #1f2130" }} onClick={() => setSelJob(selJob === job.id ? null : job.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 4 }}>
                    <span style={{ background: "#1a2010", color: "#c8f04a", fontSize: 11, padding: "3px 8px", borderRadius: 6 }}>{job.dept}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      <span style={{ background: "#1a1d26", color: "#888", fontSize: 11, padding: "3px 8px", borderRadius: 6 }}>{job.type}</span>
                      <span style={{ background: "#1a1d26", color: "#888", fontSize: 11, padding: "3px 8px", borderRadius: 6 }}>{job.location}</span>
                    </div>
                  </div>
                  <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 6 }}>{job.title}</h3>
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{job.desc}</p>
                  {selJob === job.id && (
                    <div style={{ marginTop: 14, borderTop: "1px solid #1f2130", paddingTop: 12 }}>
                      {[["Name", "text", "name"], ["Email", "email", "email"]].map(([l, t, k]) => (
                        <div key={k} style={{ marginBottom: 10 }}><label style={S.lbl}>{l}</label><input type={t} value={career[k] || ""} onChange={e => setCareer({ ...career, [k]: e.target.value })} style={S.inp} placeholder={l} /></div>
                      ))}
                      <div style={{ marginBottom: 10 }}><label style={S.lbl}>Why are you a good fit?</label><textarea value={career.msg || ""} onChange={e => setCareer({ ...career, msg: e.target.value })} style={{ ...S.inp, height: 70, resize: "vertical" }} /></div>
                      <button onClick={e => { e.stopPropagation(); const id = "CA-" + String(careerApps.length + 1).padStart(3, "0"); setCareerApps([...careerApps, { id, jobTitle: job.title, name: career.name, email: career.email, msg: career.msg, date: new Date().toISOString().split("T")[0], status: "Under Review" }]); setCareerSent(job.id); setTimeout(() => setCareerSent(false), 3000); setCareer({ name: "", email: "", msg: "" }); }} style={{ ...S.pill, width: "100%" }}>Submit →</button>
                      {careerSent === job.id && <p style={{ color: "#22c55e", fontSize: 12, marginTop: 6 }}>✓ Submitted!</p>}
                    </div>
                  )}
                </div>
              } />
            ))}
          </div>
        </div>
      )}

      {/* ═══ ADMIN ═══ */}
      {page === "admin" && (
        <div style={S.page}>
          {!adminAuth ? (
            <div style={{ maxWidth: 420, margin: "40px auto" }}>
              <R c={<div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ width: 56, height: 56, background: "linear-gradient(135deg,#f97316,#ef4444)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24 }}>🔐</div>
                <h1 style={{ ...S.pageH1, fontSize: 24, marginBottom: 4 }}>Admin Login</h1>
              </div>} />
              <R d={.1} c={
                <div style={{ ...S.panel, border: "1px solid #f97316" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div><label style={S.lbl}>Username</label><input type="text" value={adminCreds.user} onChange={e => setAdminCreds({ ...adminCreds, user: e.target.value })} style={S.inp} placeholder="admin" /></div>
                    <div><label style={S.lbl}>Password</label><input type="password" value={adminCreds.pass} onChange={e => setAdminCreds({ ...adminCreds, pass: e.target.value })} onKeyDown={e => e.key === "Enter" && (adminCreds.user === "admin" && adminCreds.pass === "admin123" ? setAdminAuth(true) : setAdminErr("Invalid credentials."))} style={S.inp} placeholder="••••••••" /></div>
                    {adminErr && <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{adminErr}</p>}
                    <button onClick={() => { if (adminCreds.user === "admin" && adminCreds.pass === "admin123") setAdminAuth(true); else setAdminErr("Invalid credentials."); }} style={{ ...S.pill, background: "linear-gradient(135deg,#f97316,#ef4444)", color: "#fff", width: "100%" }}>Login →</button>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ flex: 1, height: 1, background: "#1f2130" }} /><span style={{ color: "#555", fontSize: 12 }}>or</span><div style={{ flex: 1, height: 1, background: "#1f2130" }} /></div>
                    <GoogleBtn label="Sign in with Google" onPick={a => handleGooglePick(a, "admin")} />
                    <p style={{ color: "#555", fontSize: 11, textAlign: "center", margin: 0 }}>Demo: admin / admin123</p>
                  </div>
                </div>
              } />
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
                <div><h1 style={{ ...S.pageH1, marginBottom: 2 }}>Admin Panel</h1><p style={{ color: "#6b7280", fontSize: 13 }}>Welcome back, Admin 👋</p></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => nav("agent")} style={{ ...S.pill, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: 12 }}>🤖 AI Agent</button>
                  <button onClick={() => setAdminAuth(false)} style={{ ...S.ghost, color: "#ef4444", borderColor: "#ef4444", fontSize: 12, padding: "8px 14px" }}>Logout</button>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap", borderBottom: "1px solid #1f2130", paddingBottom: 12 }}>
                {[["dashboard", "📊 Dashboard"], ["proposals", "📋 Proposals"], ["retailers", "🏪 Retailers"], ["employees", "👥 Employees"], ["careers", "💼 Careers"], ["map", "🗺️ Map"], ["settings", "⚙️ Settings"]].map(([t, l]) => (
                  <button key={t} onClick={() => setAdminTab(t)} style={{ background: adminTab === t ? "#f97316" : "#13151c", color: adminTab === t ? "#0f1117" : "#888", border: "none", borderRadius: 8, padding: "7px 13px", fontSize: 12, cursor: "pointer", fontWeight: adminTab === t ? 700 : 400, fontFamily: "inherit" }}>{l}</button>
                ))}
              </div>
              {adminTab === "dashboard" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 20 }}>
                    <StatCard icon="📋" label="Proposals" val={proposals.length} accent="#c8f04a" />
                    <StatCard icon="✅" label="Approved" val={proposals.filter(p => p.status === "Approved").length} accent="#22c55e" />
                    <StatCard icon="🏪" label="Retailers" val={retailers.length} accent="#60a5fa" />
                    <StatCard icon="👥" label="Employees" val={employees.length} accent="#a78bfa" />
                    <StatCard icon="👁️" label="Visits/mo" val={SITE_VISITS[SITE_VISITS.length - 1]} accent="#f97316" />
                    <StatCard icon="💰" label="Paid" val={proposals.filter(p => p.payment === "Paid").length} accent="#f59e0b" />
                  </div>
                  {/* Visit trend */}
                  <div style={{ ...S.panel, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <h3 style={{ color: "#fff", fontFamily: "Syne", fontWeight: 700, fontSize: 14, margin: 0 }}>Site Visits — 12 Months</h3>
                      <span style={{ color: "#22c55e", fontSize: 12, fontWeight: 700 }}>↑ +38% YoY</span>
                    </div>
                    <Sparkline data={SITE_VISITS} color="#c8f04a" height={60} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      {MONTHS.filter((_, i) => i % 3 === 0).map(m => <span key={m} style={{ fontSize: 10, color: "#555" }}>{m}</span>)}
                    </div>
                  </div>
                  {/* Employee target summary */}
                  <div style={S.panel}>
                    <h3 style={{ color: "#fff", fontFamily: "Syne", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Employee Target Summary</h3>
                    {employees.map(e => {
                      const overall = Math.round((pct(e.achieved.proposals, e.target.proposals) + pct(e.achieved.clients, e.target.clients) + pct(e.achieved.revenue, e.target.revenue)) / 3);
                      return <PctBar key={e.id} val={overall} label={`${e.name} (${e.dept})`} />;
                    })}
                  </div>
                </div>
              )}
              {adminTab === "proposals" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ color: "#fff", fontFamily: "Syne", fontWeight: 700, fontSize: 15 }}>All Proposals ({proposals.length})</span>
                    <button onClick={() => exportCSV(proposals, "proposals.csv")} style={{ ...S.ghost, fontSize: 12, padding: "7px 12px" }}>⬇ Export CSV</button>
                  </div>
                  <div style={{ overflowX: "auto", border: "1px solid #1f2130", borderRadius: 12 }}>
                    <table style={S.tbl}><thead><tr style={{ background: "#1a1d26" }}>{["ID", "Date", "Client", "Service", "Budget", "Status", "Payment", "Retailer", "Del"].map(h => <th key={h} style={TS.th}>{h}</th>)}</tr></thead>
                      <tbody>{proposals.map((p, i) => (
                        <tr key={p.id} style={{ background: i % 2 === 0 ? "#13151c" : "#0f1117" }}>
                          <td style={TS.td}><span style={{ color: "#c8f04a", fontFamily: "monospace", fontSize: 11 }}>{p.id}</span></td>
                          <td style={{ ...TS.td, fontSize: 11, color: "#888" }}>{p.date}</td>
                          <td style={{ ...TS.td, fontWeight: 600 }}>{p.client}</td>
                          <td style={{ ...TS.td, fontSize: 12 }}>{p.service}</td>
                          <td style={{ ...TS.td, color: "#c8f04a" }}>{p.budget}</td>
                          <td style={TS.td}><select value={p.status} onChange={e => setProposals(proposals.map(x => x.id === p.id ? { ...x, status: e.target.value } : x))} style={{ background: "transparent", border: `1px solid ${sColor(p.status)}`, color: sColor(p.status), borderRadius: 6, padding: "2px 5px", fontSize: 11, cursor: "pointer" }}><option>Pending</option><option>Review</option><option>Approved</option><option>Rejected</option></select></td>
                          <td style={TS.td}><select value={p.payment} onChange={e => setProposals(proposals.map(x => x.id === p.id ? { ...x, payment: e.target.value } : x))} style={{ background: "transparent", border: `1px solid ${pColor(p.payment)}`, color: pColor(p.payment), borderRadius: 6, padding: "2px 5px", fontSize: 11, cursor: "pointer" }}><option>Unpaid</option><option>Partial</option><option>Paid</option></select></td>
                          <td style={{ ...TS.td, color: "#60a5fa", fontSize: 11 }}>{p.retailerId || "—"}</td>
                          <td style={TS.td}><button onClick={() => setProposals(proposals.filter(x => x.id !== p.id))} style={{ background: "transparent", border: "1px solid #333", color: "#ef4444", borderRadius: 6, padding: "2px 7px", fontSize: 11, cursor: "pointer" }}>✕</button></td>
                        </tr>
                      ))}</tbody></table>
                  </div>
                </div>
              )}
              {adminTab === "retailers" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ color: "#fff", fontFamily: "Syne", fontWeight: 700, fontSize: 15 }}>Retailers ({retailers.length})</span>
                    <button onClick={() => exportCSV(retailers, "retailers.csv")} style={{ ...S.ghost, fontSize: 12, padding: "7px 12px" }}>⬇ Export CSV</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
                    {retailers.map(r => (
                      <div key={r.id} style={{ ...S.panel, padding: 18 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>{(r.avatar || r.name?.charAt(0))}</div>
                          <div style={{ flex: 1 }}>
                            <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: "0 0 2px" }}>{r.name}</p>
                            <p style={{ color: "#888", fontSize: 12, margin: 0 }}>{r.email}</p>
                          </div>
                          <select value={r.status} onChange={e => setRetailers(retailers.map(x => x.id === r.id ? { ...x, status: e.target.value } : x))} style={{ background: "transparent", border: `1px solid ${r.status === "Active" ? "#22c55e" : r.status === "Pending" ? "#f59e0b" : "#ef4444"}`, color: r.status === "Active" ? "#22c55e" : r.status === "Pending" ? "#f59e0b" : "#ef4444", borderRadius: 6, padding: "3px 6px", fontSize: 11, cursor: "pointer" }}><option>Active</option><option>Pending</option><option>Blocked</option></select>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, color: "#888" }}>📍 {r.city || "—"}</span>
                          <span style={{ fontSize: 11, color: "#888" }}>📞 {r.phone || "—"}</span>
                          {r.googleId && <span style={{ background: "#1a2030", color: "#60a5fa", fontSize: 10, padding: "2px 7px", borderRadius: 4 }}>🔵 Google</span>}
                        </div>
                        {/* Retailer message */}
                        <div style={{ borderTop: "1px solid #1f2130", paddingTop: 10 }}>
                          <p style={{ color: "#888", fontSize: 11, marginBottom: 6 }}>Send message to retailer:</p>
                          {(retMsgs[r.id] || []).map((m, i) => (
                            <div key={i} style={{ background: "#0f1117", borderRadius: 6, padding: "6px 10px", marginBottom: 6, fontSize: 12, color: "#e5e7eb" }}>{m.text}<span style={{ color: "#555", fontSize: 10, marginLeft: 8 }}>{m.time}</span></div>
                          ))}
                          <div style={{ display: "flex", gap: 6 }}>
                            <input placeholder="Type a message..." value={retMsgTarget === r.id ? retMsgText : ""} onFocus={() => setRetMsgTarget(r.id)} onChange={e => { setRetMsgTarget(r.id); setRetMsgText(e.target.value); }} onKeyDown={e => e.key === "Enter" && sendRetailerMsg(r.id)} style={{ ...S.inp, padding: "7px 10px", fontSize: 12, flex: 1 }} />
                            <button onClick={() => sendRetailerMsg(r.id)} style={{ background: "#c8f04a", color: "#0f1117", border: "none", borderRadius: 6, padding: "7px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Send</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {adminTab === "employees" && <EmployeeManager employees={employees} setEmployees={setEmployees} proposals={proposals} />}
              {adminTab === "careers" && (
                <div>
                  <span style={{ color: "#fff", fontFamily: "Syne", fontWeight: 700, fontSize: 15, display: "block", marginBottom: 14 }}>Applications ({careerApps.length})</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
                    {careerApps.map(a => (
                      <div key={a.id} style={{ ...S.panel, padding: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ color: "#c8f04a", fontSize: 11, fontFamily: "monospace" }}>{a.id}</span>
                          <select value={a.status} onChange={e => setCareerApps(careerApps.map(x => x.id === a.id ? { ...x, status: e.target.value } : x))} style={{ background: "transparent", border: "1px solid #333", color: "#888", borderRadius: 6, padding: "2px 6px", fontSize: 11, cursor: "pointer" }}><option>Under Review</option><option>Shortlisted</option><option>Rejected</option><option>Hired</option></select>
                        </div>
                        <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{a.name}</p>
                        <p style={{ color: "#60a5fa", fontSize: 12, marginBottom: 6 }}>{a.email}</p>
                        <p style={{ color: "#c8f04a", fontSize: 11, marginBottom: 8 }}>🎯 {a.jobTitle}</p>
                        <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{a.msg}</p>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#555", fontSize: 11 }}>{a.date}</span>
                          <button onClick={() => setCareerApps(careerApps.filter(x => x.id !== a.id))} style={{ background: "transparent", border: "1px solid #333", color: "#ef4444", borderRadius: 6, padding: "2px 9px", fontSize: 11, cursor: "pointer" }}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {adminTab === "map" && <div style={{ marginTop: 8 }}><MarketMap /></div>}
              {adminTab === "settings" && (
                <div style={{ maxWidth: 500 }}>
                  <div style={S.panel}>
                    <h3 style={{ color: "#fff", fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Settings</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {[["Business Name", "text", "O2O Market"], ["Admin Email", "email", "admin@o2omarket.in"], ["Phone", "tel", "+91 98200 12345"]].map(([l, t, v]) => (
                        <div key={l}><label style={S.lbl}>{l}</label><input type={t} defaultValue={v} style={S.inp} /></div>
                      ))}
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button onClick={() => exportCSV(proposals, "proposals.csv")} style={S.pill}>⬇ Proposals CSV</button>
                        <button onClick={() => exportCSV(retailers, "retailers.csv")} style={S.ghost}>⬇ Retailers CSV</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ RETAILER ═══ */}
      {page === "retailer" && (
        <div style={S.page}>
          {!retailerAuth ? (
            <div style={{ maxWidth: 440, margin: "40px auto" }}>
              <R c={<div style={{ textAlign: "center", marginBottom: 22 }}>
                <div style={{ width: 56, height: 56, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 24 }}>🏪</div>
                <h1 style={{ ...S.pageH1, fontSize: 24, marginBottom: 4 }}>Retailer Portal</h1>
              </div>} />
              <R d={.1} c={
                <div>
                  <div style={{ display: "flex", marginBottom: 14, border: "1px solid #1f2130", borderRadius: 10, overflow: "hidden" }}>
                    <button onClick={() => setRMode("login")} style={{ flex: 1, padding: "10px", background: rMode === "login" ? "#3b82f6" : "#13151c", color: rMode === "login" ? "#fff" : "#888", border: "none", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Login</button>
                    <button onClick={() => setRMode("register")} style={{ flex: 1, padding: "10px", background: rMode === "register" ? "#3b82f6" : "#13151c", color: rMode === "register" ? "#fff" : "#888", border: "none", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Register</button>
                  </div>
                  <div style={{ ...S.panel, border: "1px solid #3b82f6" }}>
                    {rMode === "login" ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                        <div><label style={S.lbl}>Email</label><input type="email" value={rLogin.email} onChange={e => setRLogin({ ...rLogin, email: e.target.value })} style={S.inp} placeholder="your@email.com" /></div>
                        <div><label style={S.lbl}>Password</label><input type="password" value={rLogin.pass} onChange={e => setRLogin({ ...rLogin, pass: e.target.value })} onKeyDown={e => { if (e.key === "Enter") { const f = retailers.find(r => r.email === rLogin.email && r.password === rLogin.pass); if (f) { setRetailerAuth(f); setRErr(""); } else setRErr("Invalid credentials."); } }} style={S.inp} placeholder="••••••••" /></div>
                        {rErr && <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{rErr}</p>}
                        <button onClick={() => { const f = retailers.find(r => r.email === rLogin.email && r.password === rLogin.pass); if (f) { setRetailerAuth(f); setRErr(""); } else setRErr("Invalid credentials."); }} style={{ ...S.pill, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "#fff", width: "100%" }}>Login →</button>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ flex: 1, height: 1, background: "#1f2130" }} /><span style={{ color: "#555", fontSize: 12 }}>or</span><div style={{ flex: 1, height: 1, background: "#1f2130" }} /></div>
                        <GoogleBtn label="Continue with Google" onPick={a => handleGooglePick(a, "retailer")} />
                        <p style={{ color: "#555", fontSize: 11, textAlign: "center", margin: 0 }}>Demo: ravi@spices.in / ravi123</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[["Business Name", "text", "name"], ["Email", "email", "email"], ["Phone", "tel", "phone"], ["City", "text", "city"], ["GST", "text", "gst"]].map(([l, t, k]) => (
                          <div key={k}><label style={S.lbl}>{l}</label><input type={t} value={rReg[k]} onChange={e => setRReg({ ...rReg, [k]: e.target.value })} style={S.inp} placeholder={l} /></div>
                        ))}
                        <div><label style={S.lbl}>Password</label><input type="password" value={rReg.pass} onChange={e => setRReg({ ...rReg, pass: e.target.value })} style={S.inp} placeholder="Create password" /></div>
                        <button onClick={() => { if (!rReg.name || !rReg.email || !rReg.pass) return; const id = "R" + String(retailers.length + 1).padStart(3, "0"); const nr = { ...rReg, id, status: "Active", joined: new Date().toISOString().split("T")[0], avatar: rReg.name.substring(0, 2).toUpperCase(), googleId: null }; setRetailers(p => [...p, nr]); setRetailerAuth(nr); }} style={{ ...S.pill, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "#fff", width: "100%" }}>Create Account →</button>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ flex: 1, height: 1, background: "#1f2130" }} /><span style={{ color: "#555", fontSize: 12 }}>or</span><div style={{ flex: 1, height: 1, background: "#1f2130" }} /></div>
                        <GoogleBtn label="Register with Google" onPick={a => handleGooglePick(a, "retailer")} />
                      </div>
                    )}
                  </div>
                </div>
              } />
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 700 }}>{retailerAuth.avatar || retailerAuth.name?.charAt(0)}</div>
                  <div><h1 style={{ ...S.pageH1, fontSize: 20, marginBottom: 1 }}>Welcome, {retailerAuth.name}</h1><p style={{ color: "#60a5fa", fontSize: 12, margin: 0 }}>{retailerAuth.id} · {retailerAuth.googleId ? "🔵 Google" : "🔑 Password"}</p></div>
                </div>
                <button onClick={() => { setRetailerAuth(null); setRTab("dashboard"); }} style={{ ...S.ghost, color: "#ef4444", borderColor: "#ef4444", fontSize: 12, padding: "7px 14px" }}>Logout</button>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", borderBottom: "1px solid #1f2130", paddingBottom: 12 }}>
                {[["dashboard", "📊 Dashboard"], ["proposals", "📋 My Proposals"], ["new", "＋ New Proposal"], ["profile", "👤 Profile"]].map(([t, l]) => (
                  <button key={t} onClick={() => setRTab(t)} style={{ background: rTab === t ? "#3b82f6" : "#13151c", color: rTab === t ? "#fff" : "#888", border: "none", borderRadius: 8, padding: "7px 13px", fontSize: 12, cursor: "pointer", fontWeight: rTab === t ? 700 : 400, fontFamily: "inherit" }}>{l}</button>
                ))}
              </div>
              {rTab === "dashboard" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 20 }}>
                    <StatCard icon="📋" label="Proposals" val={myProps.length} accent="#60a5fa" />
                    <StatCard icon="✅" label="Approved" val={myProps.filter(p => p.status === "Approved").length} accent="#22c55e" />
                    <StatCard icon="⏳" label="Pending" val={myProps.filter(p => p.status === "Pending").length} accent="#f59e0b" />
                    <StatCard icon="💰" label="Paid" val={myProps.filter(p => p.payment === "Paid").length} accent="#c8f04a" />
                  </div>
                  {myProps.length === 0 ? <div style={{ ...S.panel, textAlign: "center", padding: "40px" }}>
                    <p style={{ fontSize: 32, marginBottom: 10 }}>📭</p>
                    <p style={{ color: "#6b7280", marginBottom: 14 }}>No proposals yet.</p>
                    <button onClick={() => setRTab("new")} style={S.pill}>Submit First Proposal →</button>
                  </div> : (
                    <div style={{ overflowX: "auto", border: "1px solid #1f2130", borderRadius: 12 }}>
                      <table style={S.tbl}><thead><tr style={{ background: "#1a1d26" }}>{["ID", "Date", "Service", "Budget", "Status", "Payment"].map(h => <th key={h} style={TS.th}>{h}</th>)}</tr></thead>
                        <tbody>{myProps.map((p, i) => (
                          <tr key={p.id} style={{ background: i % 2 === 0 ? "#13151c" : "#0f1117" }}>
                            <td style={TS.td}><span style={{ color: "#60a5fa", fontFamily: "monospace", fontSize: 11 }}>{p.id}</span></td>
                            <td style={{ ...TS.td, fontSize: 11, color: "#888" }}>{p.date}</td>
                            <td style={{ ...TS.td, fontSize: 12 }}>{p.service}</td>
                            <td style={{ ...TS.td, color: "#c8f04a" }}>{p.budget}</td>
                            <td style={TS.td}><span style={{ color: sColor(p.status), fontWeight: 600, fontSize: 12 }}>● {p.status}</span></td>
                            <td style={TS.td}><span style={{ color: pColor(p.payment), fontWeight: 600, fontSize: 12 }}>● {p.payment}</span></td>
                          </tr>
                        ))}</tbody></table>
                    </div>
                  )}
                </div>
              )}
              {rTab === "proposals" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
                  {myProps.length === 0 ? <div style={{ ...S.panel, textAlign: "center", padding: "40px" }}><p style={{ color: "#6b7280" }}>No proposals yet.</p><button onClick={() => setRTab("new")} style={{ ...S.pill, marginTop: 12 }}>Submit →</button></div> :
                    myProps.map(p => (
                      <div key={p.id} style={{ ...S.panel, padding: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ color: "#60a5fa", fontFamily: "monospace", fontSize: 11 }}>{p.id}</span><span style={{ color: "#888", fontSize: 11 }}>{p.date}</span></div>
                        <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.service}</p>
                        <p style={{ color: "#c8f04a", fontFamily: "Syne", fontWeight: 800, fontSize: 18, marginBottom: 10 }}>{p.budget}</p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ border: `1px solid ${sColor(p.status)}`, color: sColor(p.status), fontSize: 11, padding: "3px 9px", borderRadius: 6, fontWeight: 600 }}>● {p.status}</span>
                          <span style={{ border: `1px solid ${pColor(p.payment)}`, color: pColor(p.payment), fontSize: 11, padding: "3px 9px", borderRadius: 6, fontWeight: 600 }}>💳 {p.payment}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {rTab === "new" && (
                <div style={{ maxWidth: 580 }}>
                  <div style={S.panel}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
                      <div><label style={S.lbl}>Service</label><select value={rProp.service} onChange={e => setRProp({ ...rProp, service: e.target.value })} style={S.inp}>{SERVICES.map(s => <option key={s.title}>{s.title}</option>)}</select></div>
                      <div><label style={S.lbl}>Budget (₹)</label><input value={rProp.budget} onChange={e => setRProp({ ...rProp, budget: e.target.value })} style={S.inp} placeholder="₹50,000" /></div>
                      <div><label style={S.lbl}>Timeline</label><input value={rProp.timeline} onChange={e => setRProp({ ...rProp, timeline: e.target.value })} style={S.inp} placeholder="3 weeks" /></div>
                      <div style={{ gridColumn: "1/-1" }}><label style={S.lbl}>Description</label><textarea value={rProp.description} onChange={e => setRProp({ ...rProp, description: e.target.value })} style={{ ...S.inp, height: 80, resize: "vertical" }} placeholder="What do you need?" /></div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
                      <button onClick={retailerPropSubmit} style={{ ...S.pill, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "#fff" }}>Submit →</button>
                      {rPropSent && <span style={{ color: "#22c55e", fontSize: 13 }}>✓ Submitted!</span>}
                    </div>
                  </div>
                </div>
              )}
              {rTab === "profile" && (
                <div style={{ maxWidth: 480 }}>
                  <div style={S.panel}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid #1f2130" }}>
                      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 700 }}>{retailerAuth.avatar || retailerAuth.name?.charAt(0)}</div>
                      <div>
                        <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: "0 0 2px" }}>{retailerAuth.name}</p>
                        <p style={{ color: "#60a5fa", fontSize: 12, margin: "0 0 4px" }}>{retailerAuth.email}</p>
                        <span style={{ background: "#1a2a1a", color: "#22c55e", fontSize: 11, padding: "2px 9px", borderRadius: 5, fontWeight: 600 }}>● {retailerAuth.status}</span>
                        {retailerAuth.googleId && <span style={{ background: "#1a2030", color: "#60a5fa", fontSize: 11, padding: "2px 9px", borderRadius: 5, marginLeft: 6 }}>🔵 Google</span>}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      {[["ID", retailerAuth.id], ["Phone", retailerAuth.phone || "—"], ["City", retailerAuth.city || "—"], ["GST", retailerAuth.gst || "—"], ["Joined", retailerAuth.joined], ["Login", retailerAuth.googleId ? "Google OAuth" : "Password"]].map(([l, v]) => (
                        <div key={l}><p style={{ color: "#888", fontSize: 10, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>{l}</p><p style={{ color: "#e5e7eb", fontSize: 13, fontWeight: 500 }}>{v}</p></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ background: "#0a0b0f", borderTop: "1px solid #1a1d26", padding: "20px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={S.logoMark}>O2O</span>
            <span style={{ color: "#888", fontSize: 12 }}>© 2025 O2O Market. All rights reserved.</span>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {["home", "agent", "market-map", "proposals", "contact", "careers", "retailer", "admin"].map(p => (
              <button key={p} onClick={() => nav(p)} style={{ background: "none", border: "none", color: "#555", fontSize: 12, cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit", padding: 0 }}>{p === "market-map" ? "Map" : p === "agent" ? "AI Agent" : p}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────────────────────
const ST = {
  root: { minHeight: "100vh", background: "#0f1117", color: "#e5e7eb", fontFamily: "'DM Sans',sans-serif", overflowX: "hidden" },
  nav: { position: "sticky", top: 0, zIndex: 100, background: "rgba(15,17,23,.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1d26" },
  navWrap: { maxWidth: 1200, margin: "0 auto", padding: "0 16px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  logo: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 },
  logoMark: { background: "#c8f04a", color: "#0f1117", fontFamily: "Syne", fontWeight: 800, fontSize: 14, padding: "4px 8px", borderRadius: 6, letterSpacing: ".04em" },
  logoText: { fontFamily: "Syne", fontWeight: 700, fontSize: 16, color: "#fff" },
  navLinks: { display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" },
  navBtn: { background: "none", border: "none", color: "#888", fontSize: 13, fontFamily: "'DM Sans',sans-serif", padding: "6px 10px", cursor: "pointer", borderRadius: 8, whiteSpace: "nowrap" },
  navActive: { color: "#fff", background: "#1a1d26" },
  pill: { background: "#c8f04a", color: "#0f1117", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", whiteSpace: "nowrap" },
  ghost: { background: "transparent", color: "#fff", border: "1px solid #333", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", cursor: "pointer" },
  hero: { position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  heroInner: { position: "relative", maxWidth: 740, margin: "0 auto", padding: "80px 24px", textAlign: "center" },
  badge: { display: "inline-block", background: "#1a2010", color: "#c8f04a", border: "1px solid #2a4020", borderRadius: 20, padding: "6px 14px", fontSize: 12, marginBottom: 20 },
  h1: { fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(34px,6vw,68px)", lineHeight: 1.08, color: "#fff", margin: "0 0 16px" },
  heroP: { fontSize: 16, color: "#9ca3af", lineHeight: 1.75, maxWidth: 500, margin: "0 auto 28px" },
  sec: { maxWidth: 1200, margin: "0 auto", padding: "64px 24px" },
  secTag: { textTransform: "uppercase", letterSpacing: ".12em", fontSize: 11, color: "#c8f04a", fontWeight: 700, marginBottom: 8 },
  h2: { fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(22px,4vw,38px)", color: "#fff", marginBottom: 32, lineHeight: 1.2 },
  card: { background: "#13151c", border: "1px solid #1f2130", borderRadius: 14, padding: 20 },
  page: { maxWidth: 1200, margin: "0 auto", padding: "50px 24px 80px" },
  pageH1: { fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(24px,4vw,44px)", color: "#fff", marginBottom: 6 },
  pageP: { fontSize: 14, color: "#6b7280" },
  panel: { background: "#13151c", border: "1px solid #1f2130", borderRadius: 14, padding: 20 },
  lbl: { display: "block", fontSize: 10, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".07em" },
  inp: { width: "100%", boxSizing: "border-box", background: "#0f1117", border: "1px solid #2a2d36", borderRadius: 8, padding: "9px 11px", color: "#fff", fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none" },
  tbl: { width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'DM Sans',sans-serif" },
};
const TS = {
  th: { padding: "9px 12px", textAlign: "left", color: "#888", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", borderBottom: "1px solid #1f2130", whiteSpace: "nowrap" },
  td: { padding: "9px 12px", color: "#e5e7eb", borderBottom: "1px solid #1a1d26", whiteSpace: "nowrap" },
};
