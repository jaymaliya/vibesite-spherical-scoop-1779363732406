"use client";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import { useState, useEffect, useRef } from "react";

const products = [
  { id: 1, img: "/product-1.jpg", name: "spherical scoop light", description: "A spherical scoop of light green pistachio ice cream, topped with chopped pistachios, in", price: 0, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Six spherical scoops", description: "Six spherical scoops of vibrant yellow-orange food with darker flecks are served in a", price: 30, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Multiple scoops chocolate", description: "Multiple scoops of chocolate brown ice cream in a rounded off-white ceramic bowl.", price: 40, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "premium product", description: "a premium product", price: 50, badge: "" }
];

const flavors = [
  { label: "Pistachio", color: "#4ade80" },
  { label: "Mango", color: "#fbbf24" },
  { label: "Chocolate", color: "#78350f" },
  { label: "Strawberry", color: "#f43f5e" },
  { label: "Vanilla", color: "#fef3c7" },
  { label: "Blueberry", color: "#818cf8" },
  { label: "Salted Caramel", color: "#d97706" },
];

const filterGroups = [
  {
    label: "Flavor Profile",
    options: ["Fruity", "Nutty", "Creamy", "Chocolatey", "Citrusy"],
  },
  {
    label: "Dietary Needs",
    options: ["Dairy-Free", "Vegan", "Gluten-Free", "Sugar-Free", "Nut-Free"],
  },
  {
    label: "Collection",
    options: ["Seasonal", "Classic", "Limited Edition", "Gifting", "New Arrivals"],
  },
];

export default function ShopPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [activeFlavor, setActiveFlavor] = useState<string | null>(null);
  const [addedMap, setAddedMap] = useState<Record<number, boolean>>({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => {
      if (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
        el.style.transition = "opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)";
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, []);

  const addRevealRef = (index: number) => (el: HTMLElement | null) => {
    revealRefs.current[index] = el;
  };

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedMap((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAddedMap((prev) => ({ ...prev, [p.id]: false })), 1500);
  };

  const toggleFilter = (group: string, option: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [group]: prev[group] === option ? null : option,
    }));
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "var(--bg, #f0e8d0)", minHeight: "100vh", color: "var(--text, #1a1a1a)" }}>

      {/* ── FIXED NAV ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: "#f0e8d0e6", backdropFilter: "blur(12px)", borderBottom: "1px solid #4ade8020" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px", height: "72px", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>

          {/* Left nav */}
          <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#1a1a1a", letterSpacing: "0.04em" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#4ade80")} onMouseLeave={e => (e.currentTarget.style.color = "#1a1a1a")}>Home</button>
            <button onClick={() => router.push("/shop")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "#4ade80", letterSpacing: "0.04em", borderBottom: "2px solid #4ade80", paddingBottom: "2px" }}>Shop</button>
            <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#1a1a1a", letterSpacing: "0.04em" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#4ade80")} onMouseLeave={e => (e.currentTarget.style.color = "#1a1a1a")}>Gifting</button>
          </nav>

          {/* Center logo */}
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.06em", color: "#1a1a1a" }}>
            Spherical Scoop
          </button>

          {/* Right nav */}
          <div style={{ display: "flex", gap: "32px", alignItems: "center", justifyContent: "flex-end" }}>
            <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#1a1a1a", letterSpacing: "0.04em" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#4ade80")} onMouseLeave={e => (e.currentTarget.style.color = "#1a1a1a")}>Our Story</button>
            <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "#1a1a1a", letterSpacing: "0.04em" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#4ade80")} onMouseLeave={e => (e.currentTarget.style.color = "#1a1a1a")}>Find Us</button>
            {/* Cart icon */}
            <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "4px" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── PAGE HERO BAND ── */}
      <section style={{ paddingTop: "72px" }}>
        <div style={{ backgroundColor: "#4ade8015", borderBottom: "1px solid #4ade8025", padding: "48px 32px 40px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "#4ade80" }}>The Full Collection</span>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "0.02em", color: "#1a1a1a", margin: "8px 0 16px" }}>
              Every Scoop, Every Flavor
            </h1>
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", fontSize: "0.875rem", color: "#6b7280" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#4ade80"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                4.9 / 5 from 12,000+ scoops served
              </span>
              <span>🚚 Free shipping over ₹999</span>
              <span>🇮🇳 Handcrafted in India</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FLAVOR EXPLORER BAR ── */}
      <section ref={addRevealRef(0)} style={{ backgroundColor: "#f0e8d0", borderBottom: "1px solid #4ade8020", padding: "24px 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600, color: "#d4cfc0", marginBottom: "16px" }}>Explore by Flavor</p>
          <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none" }}>
            {flavors.map((f) => (
              <button
                key={f.label}
                onClick={() => setActiveFlavor(activeFlavor === f.label ? null : f.label)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                  background: "none", border: "none", cursor: "pointer", flexShrink: 0,
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                  transform: activeFlavor === f.label ? "translateY(-4px)" : "translateY(0)",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = activeFlavor === f.label ? "translateY(-4px)" : "translateY(0)")}
              >
                <div style={{
                  width: "56px", height: "56px", borderRadius: "9999px",
                  backgroundColor: f.color,
                  border: activeFlavor === f.label ? "3px solid #1a1a1a" : "3px solid transparent",
                  boxShadow: activeFlavor === f.label ? `0 8px 20px -4px ${f.color}80` : `0 4px 12px -4px ${f.color}40`,
                  transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 500, color: activeFlavor === f.label ? "#1a1a1a" : "#6b7280", whiteSpace: "nowrap" }}>
                  {f.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT: SIDEBAR + GRID ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 32px 96px", display: "grid", gridTemplateColumns: "260px 1fr", gap: "56px", alignItems: "start" }}>

        {/* ── LEFT SIDEBAR FILTERS ── */}
        <aside ref={addRevealRef(1)} style={{ position: "sticky", top: "96px" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.04em", color: "#1a1a1a", marginBottom: "32px" }}>Filters</h2>
          {filterGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600, color: "#d4cfc0", marginBottom: "16px" }}>
                {group.label}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {group.options.map((option) => {
                  const isActive = activeFilters[group.label] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => toggleFilter(group.label, option)}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        background: isActive ? "#4ade8020" : "none",
                        border: isActive ? "1.5px solid #4ade80" : "1.5px solid transparent",
                        borderRadius: "8px", padding: "8px 12px", cursor: "pointer",
                        textAlign: "left", fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.875rem", fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#1a1a1a" : "#6b7280",
                        transition: "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                      }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget.style.background = "#4ade8010"); }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget.style.background = "none"); }}
                    >
                      <div style={{
                        width: "16px", height: "16px", borderRadius: "4px",
                        border: isActive ? "2px solid #4ade80" : "2px solid #d4cfc0",
                        backgroundColor: isActive ? "#4ade80" : "transparent",
                        flexShrink: 0, transition: "all 0.2s ease",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {isActive && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Clear filters */}
          <button
            onClick={() => setActiveFilters({})}
            style={{
              background: "none", border: "1.5px solid #d4cfc0", borderRadius: "8px",
              padding: "8px 16px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8125rem", fontWeight: 500, color: "#6b7280",
              transition: "border-color 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#4ade80"; e.currentTarget.style.color = "#1a1a1a"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#d4cfc0"; e.currentTarget.style.color = "#6b7280"; }}
          >
            Clear all filters
          </button>
        </aside>

        {/* ── PRODUCT GRID ── */}
        <div ref={addRevealRef(2)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Showing <strong style={{ color: "#1a1a1a" }}>4</strong> products</p>
            <select style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: 500,
              backgroundColor: "#f0e8d0", border: "1.5px solid #d4cfc0", borderRadius: "8px",
              padding: "8px 16px", color: "#1a1a1a", cursor: "pointer", outline: "none",
            }}>
              <option>Sort: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {products.map((p) => {
              const isHovered = hoveredCard === p.id;
              const isAdded = addedMap[p.id];
              const displayPrice = p.price === 0 ? 349 : p.price;

              return (
                <article
                  key={p.id}
                  onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${displayPrice}&img=${encodeURIComponent(p.img)}`)}
                  onMouseEnter={() => setHoveredCard(p.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    cursor: "pointer", borderRadius: "16px",
                    backgroundColor: "#f0e8d0",
                    boxShadow: isHovered
                      ? "0 20px 48px -12px #4ade8050"
                      : "0 8px 24px -8px #4ade8025",
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                    transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Image */}
                  <div style={{ overflow: "hidden", position: "relative", aspectRatio: "4/5" }}>
                    <img
                      src={p.img}
                      alt={p.name}
                      style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                        transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                        display: "block",
                      }}
                    />
                    {/* Ghost "Add to Cart" overlay button on hover */}
                    <div style={{
                      position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)",
                      opacity: isHovered ? 1 : 0,
                      transition: "opacity 0.3s ease",
                      pointerEvents: isHovered ? "auto" : "none",
                    }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddToCart({ ...p, price: displayPrice }); }}
                        style={{
                          padding: "10px 24px", borderRadius: "9999px",
                          border: "2px solid #fff",
                          backgroundColor: isAdded ? "#4ade80" : "rgba(240,232,208,0.85)",
                          backdropFilter: "blur(8px)",
                          color: isAdded ? "#fff" : "#1a1a1a",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.8125rem", fontWeight: 600,
                          cursor: "pointer", whiteSpace: "nowrap",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          transition: "background 0.3s ease, color 0.3s ease, transform 0.15s ease",
                        }}
                        onMouseEnter={e => { if (!isAdded) e.currentTarget.style.transform = "scale(1.04)"; }}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                        onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
                        onMouseUp={e => (e.currentTarget.style.transform = "scale(1.04)")}
                      >
                        {isAdded ? "Added ✓" : "Add to Cart"}
                      </button>
                    </div>

                    {/* New badge */}
                    {p.id === 4 && (
                      <span style={{
                        position: "absolute", top: "12px", left: "12px",
                        backgroundColor: "#4ade80", color: "#1a1a1a",
                        fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em",
                        textTransform: "uppercase", padding: "4px 10px", borderRadius: "9999px",
                      }}>
                        New
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "20px 20px 24px" }}>
                    <h3 style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.25rem", fontWeight: 400, letterSpacing: "0.04em",
                      color: "#1a1a1a", textTransform: "capitalize", marginBottom: "6px",
                    }}>
                      {p.name}
                    </h3>
                    <p style={{
                      fontSize: "0.8125rem", lineHeight: 1.6,
                      color: "#6b7280", marginBottom: "16px",
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {p.description}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1a1a1a" }}>
                        ₹{displayPrice.toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/product?name=${encodeURIComponent(p.name)}&price=${displayPrice}&img=${encodeURIComponent(p.img)}`); }}
                        style={{
                          background: "none",
                          border: "1.5px solid #4ade80",
                          borderRadius: "8px",
                          padding: "6px 14px",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.8125rem", fontWeight: 600,
                          color: "#1a1a1a", cursor: "pointer",
                          transition: "background 0.2s ease, transform 0.15s ease",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#4ade8020"; e.currentTarget.style.transform = "scale(1.02)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.transform = "scale(1)"; }}
                        onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                        onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── TRUST BAR FOOTER ── */}
      <section ref={addRevealRef(3)} style={{ backgroundColor: "#4ade8015", borderTop: "1px solid #4ade8025", padding: "48px 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}>
          {[
            { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>, title: "Free Shipping", body: "On orders above ₹999" },
            { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Quality Assured", body: "Artisan crafted every batch" },
            { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>, title: "Fresh Delivery", body: "Shipped in cold-chain packaging" },
            { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, title: "Made in India", body: "Proudly sourced, locally crafted" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
              {item.icon}
              <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.125rem", letterSpacing: "0.04em", color: "#1a1a1a", margin: 0 }}>{item.title}</h4>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "#6b7280", margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: "#1a1a1a", padding: "48px 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.06em", color: "#f0e8d0" }}>Spherical Scoop</span>
          <p style={{ fontSize: "0.8125rem", color: "#6b7280" }}>© 2025 Spherical Scoop. Pure geometry of flavor. Made in India.</p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacy", "Terms", "Shipping"].map((link) => (
              <button key={link} onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8125rem", color: "#6b7280", fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#4ade80")} onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}>
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}