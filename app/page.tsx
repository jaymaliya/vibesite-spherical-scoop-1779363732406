"use client";
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "../components/CartContext"

const products = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "Spherical Scoop Light",
    description: "A spherical scoop of light green pistachio ice cream, topped with chopped pistachios, in a light green ceramic bowl.",
    price: 299,
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "Six Spherical Scoops",
    description: "Six spherical scoops of vibrant yellow-orange food with darker flecks are served in a round, speckled beige ceramic bowl",
    price: 30,
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "Multiple Scoops Chocolate",
    description: "Multiple scoops of chocolate brown ice cream in a rounded off-white ceramic bowl.",
    price: 40,
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "Premium Product",
    description: "A premium artisanal selection crafted for the discerning palate.",
    price: 50,
  },
]

const seasonalItems = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "Pistachio Rose",
    tag: "Seasonal",
    description: "Light green pistachio with a hint of rose water — spring in a bowl.",
    price: 349,
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "Mango Saffron",
    tag: "Limited",
    description: "Vibrant mango with golden saffron threads — the taste of summer.",
    price: 399,
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "Dark Cacao",
    tag: "Limited",
    description: "Deep, roasted cacao with single-origin chocolate — intense and pure.",
    price: 449,
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "Artisan Reserve",
    tag: "Seasonal",
    description: "Our most premium seasonal offering, crafted in small batches.",
    price: 499,
  },
]

const giftCollections = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "The Pistachio Lover's Box",
    description: "Four spherical scoops of our signature pistachio, beautifully boxed and ready to gift.",
    price: 999,
    tag: "Best Seller",
  },
  {
    id: 2,
    img: "/product-3.jpg",
    name: "The Dark Indulgence Set",
    description: "A curated duo of our richest chocolate scoops — for those who believe in the deep end.",
    price: 1299,
    tag: "Gift Ready",
  },
]

export default function HomePage() {
  const router = useRouter()
  const { addItem } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const revealRefs = useRef<HTMLElement[]>([])

  useEffect(() => {
    const link1 = document.createElement("link")
    link1.rel = "preconnect"
    link1.href = "https://fonts.googleapis.com"
    document.head.appendChild(link1)

    const link2 = document.createElement("link")
    link2.rel = "preconnect"
    link2.href = "https://fonts.gstatic.com"
    link2.crossOrigin = "anonymous"
    document.head.appendChild(link2)

    const link3 = document.createElement("link")
    link3.rel = "stylesheet"
    link3.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap"
    document.head.appendChild(link3)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            el.style.opacity = "1"
            el.style.transform = "translateY(0)"
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.12 }
    )
    revealRefs.current.forEach((el) => {
      if (el) {
        el.style.opacity = "0"
        el.style.transform = "translateY(28px)"
        el.style.transition = "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)"
        observer.observe(el)
      }
    })
    return () => observer.disconnect()
  }, [])

  const addRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el)
    }
  }

  const scrollCarousel = (dir: "left" | "right") => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir === "right" ? 360 : -360, behavior: "smooth" })
    }
  }

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: p.id, name: p.name, price: p.price, img: p.img, quantity: 1 })
    setCartCount((c) => c + 1)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "var(--bg, #f0e8d0)", color: "var(--text, #1a1a1a)", overflowX: "hidden" }}>

      {/* ── FIXED NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: "rgba(240,232,208,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(74,222,128,0.18)",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          {/* Left links */}
          <div style={{ display: "flex", gap: "32px", flex: 1 }}>
            {["Shop", "Flavors", "Our Craft"].map((link) => (
              <button key={link}
                onClick={() => router.push(link === "Shop" ? "/shop" : `/${link.toLowerCase().replace(/ /g, "-")}`)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, color: "var(--text, #1a1a1a)", letterSpacing: "0.04em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", padding: "4px 0" }}
                className="hidden-mobile"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Center logo */}
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
            <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.06em", color: "var(--text, #1a1a1a)" }}>Spherical Scoop</span>
            </button>
          </div>

          {/* Right: links + cart */}
          <div style={{ display: "flex", gap: "32px", flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
            {["Gifting", "About"].map((link) => (
              <button key={link}
                onClick={() => router.push(`/${link.toLowerCase()}`)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, color: "var(--text, #1a1a1a)", letterSpacing: "0.04em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", padding: "4px 0" }}
                className="hidden-mobile"
              >
                {link}
              </button>
            ))}
            {/* Cart */}
            <button onClick={() => router.push("/cart")} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "4px", borderRadius: "8px" }}
              onFocus={(e) => (e.currentTarget.style.outline = "2px solid #4ade80")}
              onBlur={(e) => (e.currentTarget.style.outline = "none")}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "#4ade80", color: "#1a1a1a", borderRadius: "9999px", width: "18px", height: "18px", fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
              )}
            </button>

            {/* Hamburger */}
            <button onClick={() => setMobileMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "none" }} className="show-mobile"
              aria-label="Open menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, backgroundColor: "rgba(240,232,208,0.98)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "40px" }}>
          <button onClick={() => setMobileMenuOpen(false)} style={{ position: "absolute", top: "24px", right: "32px", background: "none", border: "none", cursor: "pointer" }} aria-label="Close menu">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {["Shop", "Flavors", "Our Craft", "Gifting", "About"].map((link) => (
            <button key={link}
              onClick={() => { setMobileMenuOpen(false); router.push(link === "Shop" ? "/shop" : `/${link.toLowerCase().replace(/ /g, "-")}`); }}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", letterSpacing: "0.06em", color: "var(--text, #1a1a1a)" }}>
              {link}
            </button>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{ position: "relative", width: "100%", height: "100vh", minHeight: "600px", overflow: "hidden", marginTop: "0" }}>
        <img
          src="/product-1.jpg"
          alt="Spherical scoop of pistachio ice cream in a light green ceramic bowl"
          onLoad={() => setHeroLoaded(true)}
          style={{
            width: "100%", height: "100%", objectFit: "cover", objectPosition: "center",
            transition: "transform 10s ease", transform: heroLoaded ? "scale(1.04)" : "scale(1)",
          }}
        />
        {/* Scrim — bottom third only */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(26,26,26,0.72) 0%, rgba(26,26,26,0.18) 45%, transparent 70%)",
        }} />

        {/* Trust bar */}
        <div style={{
          position: "absolute", top: "88px", left: 0, right: 0,
          display: "flex", justifyContent: "center",
          gap: "clamp(16px, 3vw, 48px)",
          flexWrap: "wrap",
          padding: "12px 32px",
        }}>
          {[
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#4ade80" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, text: "4.9 / 5 Rating" },
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, text: "12,000+ Happy Customers" },
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, text: "Made in India" },
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, text: "Free Shipping over ₹999" },
          ].map((item, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(240,232,208,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "9999px", padding: "6px 16px", fontSize: "0.8rem", fontWeight: 500, color: "#f0e8d0", whiteSpace: "nowrap" }}>
              {item.icon}{item.text}
            </span>
          ))}
        </div>

        {/* Hero text — lower third */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(32px, 6vw, 80px) clamp(24px, 6vw, 96px)", maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ maxWidth: "680px" }}>
            <span style={{ display: "inline-block", marginBottom: "16px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#4ade80", backgroundColor: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.35)", borderRadius: "9999px", padding: "4px 16px" }}>
              Pure Geometry of Flavor
            </span>
            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: "-0.01em",
              color: "#f0e8d0",
              marginBottom: "24px",
            }}>
              The Perfect<br />Sphere of Bliss
            </h1>
            <p style={{ fontSize: "1.125rem", lineHeight: 1.7, color: "rgba(240,232,208,0.85)", maxWidth: "480px", marginBottom: "32px" }}>
              Artisan ice cream sculpted into perfect spheres. Pistachio-dusted, hand-crafted, ingredient-obsessed. Every scoop a small act of joy.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button
                onClick={() => router.push("/shop")}
                style={{ padding: "16px 48px", borderRadius: "12px", border: "none", cursor: "pointer", backgroundColor: "#4ade80", color: "#1a1a1a", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem", letterSpacing: "0.02em", boxShadow: "0 12px 32px -8px #4ade8060", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s cubic-bezier(0.4,0,0.2,1)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 18px 40px -8px #4ade8080"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 12px 32px -8px #4ade8060"; }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              >
                Explore All Flavors
              </button>
              <button
                onClick={() => router.push("/our-craft")}
                style={{ padding: "16px 48px", borderRadius: "12px", border: "1.5px solid rgba(240,232,208,0.5)", cursor: "pointer", backgroundColor: "transparent", color: "#f0e8d0", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem", letterSpacing: "0.02em", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = "rgba(240,232,208,0.9)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(240,232,208,0.5)"; }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              >
                Our Craft
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: SIGNATURE FLAVORS ── */}
      <section ref={addRevealRef} style={{ maxWidth: "1280px", margin: "0 auto", padding: "clamp(64px,8vw,96px) clamp(24px,4vw,48px)" }}>
        <div style={{ marginBottom: "56px" }}>
          <span style={{ display: "inline-block", marginBottom: "12px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#4ade80" }}>Our Menu</span>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.0, color: "#1a1a1a", marginBottom: "16px" }}>
            Signature Flavors
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#6b6556", maxWidth: "520px" }}>
            Each scoop, a perfect sphere. Crafted from single-origin ingredients, balanced to astonish.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
          {products.map((p) => (
            <article
              key={p.id}
              onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              style={{ cursor: "pointer", borderRadius: "16px", overflow: "hidden", backgroundColor: "#ece4cc", boxShadow: "0 4px 24px -8px #4ade8020", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px -8px #4ade8040"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px -8px #4ade8020"; }}
            >
              <div style={{ overflow: "hidden", aspectRatio: "4/5" }}>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "24px" }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.02em", color: "#1a1a1a", marginBottom: "8px" }}>{p.name}</h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "#6b6556", marginBottom: "16px" }}>{p.description}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.125rem", fontWeight: 600, color: "#1a1a1a" }}>₹{p.price.toLocaleString("en-IN")}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(p); }}
                    style={{ padding: "10px 24px", borderRadius: "12px", border: "1.5px solid #4ade80", cursor: "pointer", backgroundColor: "transparent", color: "#1a1a1a", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s, color 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.backgroundColor = "#4ade80"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.backgroundColor = "transparent"; }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <button
            onClick={() => router.push("/shop")}
            style={{ padding: "14px 40px", borderRadius: "12px", border: "none", cursor: "pointer", backgroundColor: "#1a1a1a", color: "#f0e8d0", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.95rem", letterSpacing: "0.02em", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 24px -4px rgba(26,26,26,0.35)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          >
            View All Flavors
          </button>
        </div>
      </section>

      {/* ── SECTION 2: ART OF CRAFT ── */}
      <section ref={addRevealRef} style={{ backgroundColor: "#1a1a1a", padding: "clamp(64px,8vw,96px) 0", overflow: "hidden" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 clamp(24px,4vw,48px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "clamp(40px,6vw,80px)", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#4ade80" }}>Our Philosophy</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.01em", color: "#f0e8d0" }}>
              The Art of<br />Our Craft
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#d4cfc0", maxWidth: "480px" }}>
              Every sphere begins with a single obsession: the finest ingredients. We source pistachios from Ratnagiri, saffron from Kashmir, and cacao from Coorg — then let their natural geometry speak.
            </p>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#d4cfc0", maxWidth: "480px" }}>
              Our artisans hand-roll each scoop into a perfect sphere. No shortcuts. No artificial stabilisers. Just the honest flavor of the land.
            </p>
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", marginTop: "8px" }}>
              {[["100%", "Natural"], ["6+", "Regions Sourced"], ["Zero", "Artificial Add-ins"]].map(([num, label]) => (
                <div key={label} style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", color: "#4ade80", lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: "0.875rem", color: "#d4cfc0", marginTop: "4px" }}>{label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push("/our-craft")}
              style={{ alignSelf: "flex-start", marginTop: "8px", padding: "14px 36px", borderRadius: "12px", border: "1.5px solid #4ade80", cursor: "pointer", backgroundColor: "transparent", color: "#f0e8d0", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.95rem", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.backgroundColor = "#4ade8020"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.backgroundColor = "transparent"; }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Read Our Story
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateRows: "auto auto", gap: "16px" }}>
            <div style={{ overflow: "hidden", borderRadius: "16px", boxShadow: "0 24px 64px -16px #4ade8030" }}>
              <img
                src="/product-1.jpg"
                alt="Artisan pistachio scoop being crafted by hand"
                style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ overflow: "hidden", borderRadius: "16px" }}>
                <img src="/product-2.jpg" alt="Vibrant seasonal scoops in ceramic bowl" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
              <div style={{ overflow: "hidden", borderRadius: "16px" }}>
                <img src="/product-3.jpg" alt="Chocolate scoops in ceramic bowl" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SEASONAL & LIMITED ── */}
      <section ref={addRevealRef} style={{ padding: "clamp(64px,8vw,96px) 0", overflow: "hidden" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 clamp(24px,4vw,48px)", marginBottom: "48px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span style={{ display: "inline-block", marginBottom: "12px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#4ade80" }}>Now Available</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.0, color: "#1a1a1a" }}>
              Seasonal &<br />Limited Editions
            </h2>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => scrollCarousel("left")}
              style={{ width: "48px", height: "48px", borderRadius: "9999px", border: "1.5px solid #1a1a1a", cursor: "pointer", backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1a1a1a"; (e.currentTarget.querySelector("svg") as SVGElement | null) && ((e.currentTarget.querySelector("svg") as SVGElement).style.stroke = "#f0e8d0"); }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; (e.currentTarget.querySelector("svg") as SVGElement | null) && ((e.currentTarget.querySelector("svg") as SVGElement).style.stroke = "#1a1a1a"); }}
              aria-label="Scroll left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              style={{ width: "48px", height: "48px", borderRadius: "9999px", border: "1.5px solid #1a1a1a", cursor: "pointer", backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1a1a1a"; (e.currentTarget.querySelector("svg") as SVGElement | null) && ((e.currentTarget.querySelector("svg") as SVGElement).style.stroke = "#f0e8d0"); }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; (e.currentTarget.querySelector("svg") as SVGElement | null) && ((e.currentTarget.querySelector("svg") as SVGElement).style.stroke = "#1a1a1a"); }}
              aria-label="Scroll right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          style={{
            display: "flex", gap: "24px",
            overflowX: "auto", scrollSnapType: "x mandatory",
            paddingLeft: "clamp(24px,4vw,48px)", paddingRight: "clamp(24px,4vw,48px)", paddingBottom: "8px",
            msOverflowStyle: "none", scrollbarWidth: "none",
          }}
        >
          {seasonalItems.map((item) => (
            <div
              key={item.id}
              style={{
                flexShrink: 0, width: "clamp(280px, 32vw, 340px)", scrollSnapAlign: "start",
                borderRadius: "16px", overflow: "hidden",
                backgroundColor: "#ece4cc",
                boxShadow: "0 4px 24px -8px #4ade8020",
                transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                cursor: "pointer",
              }}
              onClick={() => router.push(`/product?name=${encodeURIComponent(item.name)}&price=${item.price}&img=${encodeURIComponent(item.img)}`)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px -8px #4ade8040"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px -8px #4ade8020"; }}
            >
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                  src={item.img}
                  alt={item.name}
                  style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                <span style={{ position: "absolute", top: "16px", left: "16px", backgroundColor: "#4ade80", color: "#1a1a1a", borderRadius: "9999px", padding: "4px 14px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {item.tag}
                </span>
              </div>
              <div style={{ padding: "24px" }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.02em", color: "#1a1a1a", marginBottom: "8px" }}>{item.name}</h3>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "#6b6556", marginBottom: "20px" }}>{item.description}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1a1a1a" }}>₹{item.price.toLocaleString("en-IN")}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); router.push(`/product?name=${encodeURIComponent(item.name)}&price=${item.price}&img=${encodeURIComponent(item.img)}`); }}
                    style={{ padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer", backgroundColor: "#4ade80", color: "#1a1a1a", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 20px -4px #4ade8060"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: CURATED COLLECTIONS & GIFTING ── */}
      <section ref={addRevealRef} style={{ backgroundColor: "#ece4cc", padding: "clamp(64px,8vw,96px) 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 clamp(24px,4vw,48px)" }}>
          <div style={{ marginBottom: "56px", textAlign: "center" }}>
            <span style={{ display: "inline-block", marginBottom: "12px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#4ade80" }}>For Those You Love</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.0, color: "#1a1a1a" }}>
              Curated Collections<br />& Gifting
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#6b6556", maxWidth: "480px", margin: "16px auto 0" }}>
              Gift the experience of perfect geometry. Beautifully packaged, thoughtfully composed.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
            {giftCollections.map((gift) => (
              <article
                key={gift.id}
                style={{
                  borderRadius: "16px", overflow: "hidden",
                  backgroundColor: "#f0e8d0",
                  boxShadow: "0 4px 24px -8px #4ade8020",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                  cursor: "pointer",
                  display: "flex", flexDirection: "column",
                }}
                onClick={() => router.push(`/product?name=${encodeURIComponent(gift.name)}&price=${gift.price}&img=${encodeURIComponent(gift.img)}`)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px -8px #4ade8040"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px -8px #4ade8020"; }}
              >
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={gift.img}
                    alt={gift.name}
                    style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <span style={{ position: "absolute", top: "16px", right: "16px", backgroundColor: "#1a1a1a", color: "#4ade80", borderRadius: "9999px", padding: "4px 14px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {gift.tag}
                  </span>
                </div>
                <div style={{ padding: "28px 28px 24px", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.02em", color: "#1a1a1a" }}>{gift.name}</h3>
                  <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#6b6556", flex: 1 }}>{gift.description}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1a1a1a" }}>₹{gift.price.toLocaleString("en-IN")}</span>
                      <span style={{ fontSize: "0.8rem", color: "#6b6556", marginLeft: "8px" }}>incl. gift packaging</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart({ id: gift.id, img: gift.img, name: gift.name, price: gift.price, description: gift.description }); }}
                      style={{ padding: "12px 28px", borderRadius: "12px", border: "none", cursor: "pointer", backgroundColor: "#4ade80", color: "#1a1a1a", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 20px -4px #4ade8060"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    >
                      Gift This
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ marginTop: "48px", textAlign: "center" }}>
            <button
              onClick={() => router.push("/gifting")}
              style={{ padding: "14px 40px", borderRadius: "12px", border: "1.5px solid #1a1a1a", cursor: "pointer", backgroundColor: "transparent", color: "#1a1a1a", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.95rem", letterSpacing: "0.02em", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s, color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.backgroundColor = "#1a1a1a"; e.currentTarget.style.color = "#f0e8d0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#1a1a1a"; }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              View All Gift Sets
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS STRIP ── */}
      <section ref={addRevealRef} style={{ backgroundColor: "#4ade80", padding: "clamp(48px,6vw,72px) clamp(24px,4vw,48px)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", textAlign: "center", color: "#1a1a1a", letterSpacing: "0.04em", marginBottom: "40px" }}>
            What our customers say
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {[
              { text: "The pistachio scoop is unlike anything I've had. It actually tastes like real pistachios.", name: "Priya M., Mumbai" },
              { text: "Beautifully presented, incredibly fresh. The sphere shape is genius — it melts so evenly.", name: "Rohan K., Bangalore" },
              { text: "Gifted the pistachio box to my mother. She called me three times to thank me.", name: "Ananya S., Delhi" },
            ].map((t, i) => (
              <div key={i} style={{ backgroundColor: "rgba(26,26,26,0.08)", borderRadius: "16px", padding: "24px", backdropFilter: "blur(4px)" }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#1a1a1a" stroke="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#1a1a1a", marginBottom: "16px" }}>&ldquo;{t.text}&rdquo;</p>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1a1a1a", letterSpacing: "0.04em" }}>— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section ref={addRevealRef} style={{ padding: "clamp(64px,8vw,96px) clamp(24px,4vw,48px)", textAlign: "center" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <span style={{ display: "inline-block", marginBottom: "12px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "#4ade80" }}>Join the Circle</span>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.0, color: "#1a1a1a", marginBottom: "16px" }}>
            Be First to Know
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#6b6556", marginBottom: "32px" }}>
            New flavors, seasonal drops, and early access to limited editions — straight to your inbox.
          </p>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{ flex: 1, minWidth: "220px", padding: "14px 20px", borderRadius: "12px", border: "1.5px solid #d4cfc0", backgroundColor: "#f0e8d0", color: "#1a1a1a", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#4ade80")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#d4cfc0")}
            />
            <button
              type="submit"
              style={{ padding: "14px 32px", borderRadius: "12px", border: "none", cursor: "pointer", backgroundColor: "#1a1a1a", color: "#f0e8d0", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.95rem", transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 24px -4px rgba(26,26,26,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: "#1a1a1a", padding: "clamp(48px,6vw,80px) clamp(24px,4vw,48px) 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "48px", marginBottom: "64px" }}>
            <div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.06em", color: "#f0e8d0", marginBottom: "16px" }}>Spherical Scoop</h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#d4cfc0", maxWidth: "240px" }}>Pure geometry of flavor. Made in India, with obsessive attention to craft.</p>
              <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                {[
                  { label: "Instagram", path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z" },
                  { label: "Twitter", path: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
                ].map((s) => (
                  <button key={s.label} onClick={() => {}} style={{ background: "none", border: "1px solid rgba(240,232,208,0.2)", borderRadius: "9999px", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s, transform 0.2s" }}
                    aria-label={s.label}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4ade80"; e.currentTarget.style.transform = "scale(1.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(240,232,208,0.2)"; e.currentTarget.style.transform = "scale(1)"; }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4cfc0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={s.path} /></svg>
                  </button>
                ))}
              </div>
            </div>
            {[
              { title: "Shop", links: ["All Flavors", "Seasonal", "Classic Collection", "Gift Sets"] },
              { title: "Company", links: ["Our Craft", "About Us", "Sustainability", "Careers"] },
              { title: "Support", links: ["Shipping Info", "Returns", "FAQ", "Contact Us"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 600, color: "#4ade80", marginBottom: "20px" }}>{col.title}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                  {col.links.map((link) => (
                    <li key={link}>
                      <button onClick={() => router.push(`/${link.toLowerCase().replace(/ /g, "-")}`)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", color: "#d4cfc0", fontFamily: "'DM Sans', sans-serif", padding: 0, transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#f0e8d0")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#d4cfc0")}>
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(240,232,208,0.12)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ fontSize: "0.8rem", color: "#6b6556" }}>© {new Date().getFullYear()} Spherical Scoop. Made with obsession in India.</p>
            <p style={{ fontSize: "0.8rem", color: "#6b6556" }}>All prices in INR · Free shipping over ₹999</p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}