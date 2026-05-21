"use client";
import { useCart } from "../../components/CartContext"
import { useRouter } from "next/navigation"
import { Suspense, useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"

const products = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "spherical scoop light",
    description: "A spherical scoop of light green pistachio ice cream, topped with chopped pistachios, in a light green ceramic bowl.",
    price: 399,
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "Six spherical scoops",
    description: "Six spherical scoops of vibrant yellow-orange food with darker flecks are served in a round, speckled beige ceramic bowl",
    price: 30,
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "Multiple scoops chocolate",
    description: "Multiple scoops of chocolate brown ice cream in a rounded off-white ceramic bowl.",
    price: 40,
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "premium product",
    description: "a premium product",
    price: 50,
  },
]

const reviews = [
  {
    name: "Anika Sharma",
    date: "12 Jan 2025",
    rating: 5,
    text: "Absolutely divine! The pistachio flavour is intensely nutty and not overly sweet. The spherical presentation is stunning — it looked like a piece of art before I devoured it.",
  },
  {
    name: "Rohan Mehta",
    date: "3 Feb 2025",
    rating: 5,
    text: "Best ice cream I've had in India, hands down. You can taste real pistachios in every bite. The ceramic bowl packaging arrived perfectly — zero damage.",
  },
  {
    name: "Priya Nair",
    date: "18 Feb 2025",
    rating: 4,
    text: "The texture is incredibly creamy and the colour is so naturally beautiful. Gifted this to my sister and she was completely floored. Will order again!",
  },
  {
    name: "Karthik Iyer",
    date: "27 Feb 2025",
    rating: 5,
    text: "Ordered for a dinner party and everyone was asking where I got it from. The geometry is impeccable — perfectly spherical every single time. Worth every rupee.",
  },
]

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "#4ade80" : "none"}
      stroke="#4ade80"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function LeafIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22 L12 12" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  )
}

function AwardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  )
}

function ProductContent() {
  const searchParams = useSearchParams()
  const paramImg = searchParams.get("img") ? decodeURIComponent(searchParams.get("img")!) : null
  const paramName = searchParams.get("name") ? decodeURIComponent(searchParams.get("name")!) : null
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null

  const displayImg = paramImg ?? "/product-1.jpg"
  const displayName = paramName ?? "spherical scoop light"
  const rawPrice = paramPrice !== null && paramPrice > 0 ? paramPrice : 399
  const displayPrice = rawPrice

  const { addItem } = useCart()
  const router = useRouter()

  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("Single")
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [imgHovered, setImgHovered] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const revealRefs = useRef<HTMLElement[]>([])

  const thumbnails = [displayImg, "/product-2.jpg", "/product-3.jpg"]
  const sizes = ["Single", "Double", "Party Box"]
  const sizeMultiplier = selectedSize === "Double" ? 2 : selectedSize === "Party Box" ? 4 : 1
  const finalPrice = displayPrice * sizeMultiplier

  useEffect(() => {
    if (document.getElementById("spherical-fonts")) return
    const link = document.createElement("link")
    link.id = "spherical-fonts"
    link.rel = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap"
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1"
            ;(entry.target as HTMLElement).style.transform = "translateY(0)"
          }
        })
      },
      { threshold: 0.1 }
    )
    revealRefs.current.forEach((el) => {
      if (el) {
        el.style.opacity = "0"
        el.style.transform = "translateY(24px)"
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
        observer.observe(el)
      }
    })
    return () => observer.disconnect()
  }, [])

  const addRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  const handleAddToCart = () => {
    addItem({ id: `product-${displayName}`, name: displayName, price: finalPrice, quantity })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

  const handleBuyNow = () => {
    addItem({ id: `product-${displayName}`, name: displayName, price: finalPrice, quantity })
    router.push("/checkout")
  }

  const handleRazorpay = () => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => {
      fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalPrice * quantity * 100, currency: "INR" }),
      })
        .then((res) => res.json())
        .then((data) => {
          const options = {
            key: "rzp_test_",
            amount: finalPrice * quantity * 100,
            currency: "INR",
            name: "Spherical Scoop",
            description: displayName,
            order_id: data?.id,
            handler: () => {
              router.push("/checkout")
            },
            prefill: { name: "", email: "", contact: "" },
            theme: { color: "#4ade80" },
          }
          const rzp = new (window as any).Razorpay(options)
          rzp.open()
        })
        .catch(() => {
          router.push("/checkout")
        })
    }
    document.body.appendChild(script)
  }

  const relatedProducts = products.filter((p) => p.img !== displayImg).slice(0, 3)

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        fontFamily: "'DM Sans', sans-serif",
        color: "var(--text)",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(240, 232, 208, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(74, 222, 128, 0.15)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 32px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <button
              onClick={() => router.push("/")}
              style={{
                display: "none",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text)",
                fontSize: "0.875rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
              }}
              className="back-btn-desktop"
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--primary)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text)" }}
            >
              <ArrowLeftIcon />
              Back
            </button>
            {["Shop", "Flavors", "About"].map((link) => (
              <button
                key={link}
                onClick={() => router.push(`/${link.toLowerCase()}`)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  color: "var(--text)",
                  letterSpacing: "0.02em",
                  opacity: 0.8,
                  display: "none",
                }}
              >
                {link}
              </button>
            ))}
          </div>

          <button
            onClick={() => router.push("/")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.6rem",
              color: "var(--text)",
              letterSpacing: "0.04em",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Spherical Scoop
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <button
              onClick={() => router.push("/cart")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text)",
                display: "flex",
                alignItems: "center",
                padding: "8px",
                borderRadius: "8px",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(74,222,128,0.1)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none" }}
            >
              <CartIcon />
            </button>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text)",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text)", borderRadius: "2px", transition: "transform 0.3s ease, opacity 0.3s ease", transform: mobileNavOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text)", borderRadius: "2px", transition: "opacity 0.3s ease", opacity: mobileNavOpen ? 0 : 1 }} />
              <span style={{ display: "block", width: "22px", height: "2px", background: "var(--text)", borderRadius: "2px", transition: "transform 0.3s ease, opacity 0.3s ease", transform: mobileNavOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div
            style={{
              position: "fixed",
              top: "72px",
              left: 0,
              right: 0,
              bottom: 0,
              background: "var(--bg)",
              zIndex: 99,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "32px",
            }}
          >
            {["Home", "Shop", "Flavors", "About", "Cart"].map((link) => (
              <button
                key={link}
                onClick={() => { setMobileNavOpen(false); router.push(link === "Home" ? "/" : `/${link.toLowerCase()}`) }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "2.5rem",
                  color: "var(--text)",
                  letterSpacing: "0.04em",
                }}
              >
                {link}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* MAIN PRODUCT SECTION */}
      <main style={{ paddingTop: "96px" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "64px 32px 96px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "64px",
            alignItems: "start",
          }}
        >
          {/* LEFT — IMAGE GALLERY */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Main Image */}
            <div
              style={{
                overflow: "hidden",
                borderRadius: "24px",
                boxShadow: "0 32px 64px -16px #4ade8040",
                background: "var(--surface)",
                position: "relative",
              }}
            >
              <img
                src={thumbnails[activeImage]}
                alt={`${displayName} — main product view`}
                style={{
                  width: "100%",
                  aspectRatio: "4/5",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                  transform: imgHovered ? "scale(1.05)" : "scale(1)",
                }}
                onMouseEnter={() => setImgHovered(true)}
                onMouseLeave={() => setImgHovered(false)}
              />
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  background: "var(--primary)",
                  color: "#1a1a1a",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Made in India
              </div>
            </div>

            {/* Thumbnails */}
            <div style={{ display: "flex", gap: "12px" }}>
              {thumbnails.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    flex: 1,
                    padding: 0,
                    border: activeImage === i ? "2px solid #4ade80" : "2px solid transparent",
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "none",
                    transition: "border-color 0.2s ease, transform 0.2s ease",
                    transform: activeImage === i ? "scale(1.02)" : "scale(1)",
                    boxShadow: activeImage === i ? "0 4px 16px -4px #4ade8050" : "none",
                  }}
                  onMouseEnter={(e) => { if (activeImage !== i) (e.currentTarget as HTMLElement).style.borderColor = "#4ade8070" }}
                  onMouseLeave={(e) => { if (activeImage !== i) (e.currentTarget as HTMLElement).style.borderColor = "transparent" }}
                  aria-label={`View image ${i + 1}`}
                >
                  <img
                    src={thumb}
                    alt={`${displayName} thumbnail ${i + 1}`}
                    style={{
                      width: "100%",
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.4s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
                  />
                </button>
              ))}
            </div>

            {/* Trust Signals Strip */}
            <div
              ref={addRevealRef}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
                marginTop: "8px",
              }}
            >
              {[
                { icon: <TruckIcon />, text: "Free shipping over ₹999" },
                { icon: <LeafIcon />, text: "All-natural ingredients" },
                { icon: <AwardIcon />, text: "Award-winning recipe" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(74,222,128,0.08)",
                    borderRadius: "12px",
                    padding: "14px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    textAlign: "center",
                  }}
                >
                  {item.icon}
                  <span style={{ fontSize: "0.72rem", fontWeight: 500, color: "var(--text)", lineHeight: 1.4, opacity: 0.75 }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — PRODUCT DETAILS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", paddingTop: "8px" }}>
            {/* Back button */}
            <button
              onClick={() => router.push("/shop")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                fontSize: "0.875rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                padding: 0,
                alignSelf: "flex-start",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--primary)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)" }}
            >
              <ArrowLeftIcon />
              Back to Shop
            </button>

            {/* Brand + rating */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  fontWeight: 600,
                  color: "var(--accent)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Spherical Scoop — Artisan Collection
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={true} />)}
                </div>
                <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 500 }}>4.9 (128)</span>
              </div>
            </div>

            {/* Product name */}
            <div>
              <h1
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
                  fontWeight: 700,
                  lineHeight: 1.0,
                  letterSpacing: "0.02em",
                  color: "var(--text)",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                {displayName}
              </h1>
              <p
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  color: "var(--text)",
                  opacity: 0.7,
                  maxWidth: "480px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                A perfectly formed sphere of pistachio ice cream — made with Sicilian pistachios, organic cream, and a whisper of rose water. Each scoop is hand-finished and served in a hand-thrown ceramic bowl.
              </p>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "2.8rem",
                  color: "var(--text)",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                }}
              >
                ₹{finalPrice.toLocaleString("en-IN")}
              </span>
              {sizeMultiplier > 1 && (
                <span style={{ fontSize: "0.9rem", color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>
                  ₹{displayPrice.toLocaleString("en-IN")} / scoop
                </span>
              )}
              <span
                style={{
                  background: "rgba(74,222,128,0.15)",
                  color: "#2d9e56",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                In Stock
              </span>
            </div>

            {/* Flavor Tags */}
            <div>
              <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "var(--muted)", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
                Flavor Profile
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {["Nutty", "Floral", "Creamy", "Artisanal", "Egg-free"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "rgba(74,222,128,0.1)",
                      border: "1px solid rgba(74,222,128,0.25)",
                      borderRadius: "9999px",
                      padding: "6px 16px",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: "var(--text)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "var(--muted)", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
                Size
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: "10px 24px",
                      borderRadius: "12px",
                      border: selectedSize === size ? "2px solid #4ade80" : "2px solid rgba(26,26,26,0.15)",
                      background: selectedSize === size ? "rgba(74,222,128,0.12)" : "transparent",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      color: selectedSize === size ? "var(--text)" : "var(--muted)",
                      transition: "border-color 0.2s ease, background 0.2s ease, transform 0.2s ease",
                      transform: selectedSize === size ? "scale(1.02)" : "scale(1)",
                    }}
                    onMouseEnter={(e) => { if (selectedSize !== size) (e.currentTarget as HTMLElement).style.borderColor = "#4ade8070" }}
                    onMouseLeave={(e) => { if (selectedSize !== size) (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,26,26,0.15)" }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: "var(--muted)", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
                Quantity
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0", borderRadius: "12px", border: "2px solid rgba(26,26,26,0.12)", overflow: "hidden", width: "fit-content" }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "rgba(74,222,128,0.06)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.3rem",
                    fontWeight: 300,
                    color: "var(--text)",
                    transition: "background 0.2s ease",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(74,222,128,0.15)" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(74,222,128,0.06)" }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span
                  style={{
                    width: "56px",
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: "1rem",
                    fontFamily: "'DM Sans', sans-serif",
                    color: "var(--text)",
                    userSelect: "none",
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "rgba(74,222,128,0.06)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.3rem",
                    fontWeight: 300,
                    color: "var(--text)",
                    transition: "background 0.2s ease",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(74,222,128,0.15)" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(74,222,128,0.06)" }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={handleAddToCart}
                style={{
                  padding: "18px 40px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  background: addedToCart ? "#2d9e56" : "var(--primary)",
                  color: "#1a1a1a",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  letterSpacing: "0.02em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: "0 12px 32px -8px #4ade8060",
                  transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), background 0.3s ease, box-shadow 0.2s ease",
                  transform: "scale(1)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px -8px #4ade8070" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px -8px #4ade8060" }}
                onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.98)" }}
                onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)" }}
              >
                {addedToCart ? (
                  <>
                    <CheckIcon />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <CartIcon />
                    Add to Cart — ₹{(finalPrice * quantity).toLocaleString("en-IN")}
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                style={{
                  padding: "18px 40px",
                  borderRadius: "12px",
                  border: "2px solid var(--text)",
                  cursor: "pointer",
                  background: "transparent",
                  color: "var(--text)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  letterSpacing: "0.02em",
                  transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLElement).style.background = "rgba(26,26,26,0.05)" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.background = "transparent" }}
                onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.98)" }}
                onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)" }}
              >
                Buy Now
              </button>

              <button
                onClick={handleRazorpay}
                style={{
                  padding: "16px 40px",
                  borderRadius: "12px",
                  border: "2px solid rgba(74,222,128,0.4)",
                  cursor: "pointer",
                  background: "rgba(74,222,128,0.06)",
                  color: "var(--text)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  letterSpacing: "0.02em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLElement).style.background = "rgba(74,222,128,0.12)" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.background = "rgba(74,222,128,0.06)" }}
                onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.98)" }}
                onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                Pay with Razorpay
              </button>
            </div>

            {/* Ingredients highlight */}
            <div
              ref={addRevealRef}
              style={{
                background: "rgba(74,222,128,0.07)",
                border: "1px solid rgba(74,222,128,0.2)",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", marginBottom: "12px" }}>
                What's inside
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {["Sicilian Pistachios", "Organic Cream", "Pure Cane Sugar", "Rose Water", "No Artificial Colours", "Gluten-free"].map((ing) => (
                  <div key={ing} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.875rem", color: "var(--text)", opacity: 0.8, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{ing}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <section
          ref={addRevealRef}
          style={{
            background: "rgba(74,222,128,0.04)",
            padding: "96px 32px",
            borderTop: "1px solid rgba(74,222,128,0.12)",
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            {/* Section Header */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "56px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", display: "block", marginBottom: "8px" }}>
                  Verified Reviews
                </span>
                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                    fontWeight: 700,
                    color: "var(--text)",
                    letterSpacing: "0.02em",
                    lineHeight: 1.0,
                    textTransform: "uppercase",
                  }}
                >
                  What our fans say
                </h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", lineHeight: 1, color: "var(--text)" }}>4.9</p>
                  <div style={{ display: "flex", gap: "2px", justifyContent: "flex-end", marginBottom: "4px" }}>
                    {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={true} />)}
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>128 reviews</p>
                </div>
              </div>
            </div>

            {/* Review Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              {reviews.map((review, i) => (
                <article
                  key={i}
                  ref={addRevealRef}
                  style={{
                    background: "var(--surface)",
                    borderRadius: "16px",
                    padding: "28px",
                    boxShadow: "0 4px 24px -8px #4ade8020",
                    border: "1px solid rgba(74,222,128,0.1)",
                    transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = "translateY(-4px)"
                    el.style.boxShadow = "0 16px 48px -12px #4ade8040"
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = "translateY(0)"
                    el.style.boxShadow = "0 4px 24px -8px #4ade8020"
                  }}
                >
                  <div style={{ display: "flex", gap: "2px", marginBottom: "16px" }}>
                    {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={s <= review.rating} />)}
                  </div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      color: "var(--text)",
                      opacity: 0.8,
                      marginBottom: "20px",
                      fontStyle: "italic",
                    }}
                  >
                    "{review.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "rgba(74,222,128,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "1rem",
                          color: "var(--text)",
                        }}
                      >
                        {review.name[0]}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>{review.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>Verified Purchase</p>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "'DM Sans', sans-serif" }}>{review.date}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* RELATED PRODUCTS */}
        <section
          ref={addRevealRef}
          style={{
            padding: "96px 32px",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: "56px" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", display: "block", marginBottom: "8px" }}>
              You might also love
            </span>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "0.02em",
                lineHeight: 1.0,
                textTransform: "uppercase",
              }}
            >
              More flavors
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "32px",
            }}
          >
            {relatedProducts.map((p) => (
              <article
                key={p.id}
                ref={addRevealRef}
                onClick={() =>
                  router.push(
                    `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                  )
                }
                style={{
                  cursor: "pointer",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)" }}
              >
                <div
                  style={{
                    overflow: "hidden",
                    borderRadius: "16px",
                    marginBottom: "16px",
                    boxShadow: "0 8px 32px -8px #4ade8030",
                    background: "var(--surface)",
                  }}
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      aspectRatio: "4/5",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
                  />
                </div>
                <h3
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "var(--text)",
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.875rem",
                    color: "var(--muted)",
                    lineHeight: 1.5,
                    marginBottom: "10px",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {p.description}
                </p>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "var(--text)",
                  }}
                >
                  ₹{(p.price > 0 ? p.price : 399).toLocaleString("en-IN")}
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            borderTop: "1px solid rgba(74,222,128,0.15)",
            padding: "48px 32px",
            background: "var(--bg)",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <button
              onClick={() => router.push("/")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.4rem",
                color: "var(--text)",
                letterSpacing: "0.04em",
              }}
            >
              Spherical Scoop
            </button>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "var(--muted)" }}>
              Pure geometry of flavor. Made in India. © 2025 Spherical Scoop.
            </p>
            <div style={{ display: "flex", gap: "24px" }}>
              {["Privacy", "Terms", "Contact"].map((link) => (
                <button
                  key={link}
                  onClick={() => router.push(`/${link.toLowerCase()}`)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.8rem",
                    color: "var(--muted)",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)" }}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </footer>
      </main>

      {/* STICKY MOBILE BOTTOM BAR */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(240, 232, 208, 0.96)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(74,222,128,0.2)",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 -8px 32px -8px #4ade8030",
        }}
      >
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: "var(--text)", lineHeight: 1, letterSpacing: "0.02em" }}>
            ₹{(finalPrice * quantity).toLocaleString("en-IN")}
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "var(--muted)", lineHeight: 1.2, marginTop: "2px" }}>
            {quantity} × {selectedSize}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          style={{
            padding: "14px 28px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background: addedToCart ? "#2d9e56" : "var(--primary)",
            color: "#1a1a1a",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 8px 24px -6px #4ade8060",
            transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), background 0.3s ease",
            flexShrink: 0,
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.97)" }}
          onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)" }}
        >
          {addedToCart ? (
            <>
              <CheckIcon />
              Added!
            </>
          ) : (
            <>
              <CartIcon />
              Add to Cart
            </>
          )}
        </button>
        <button
          onClick={handleBuyNow}
          style={{
            padding: "14px 24px",
            borderRadius: "12px",
            border: "2px solid var(--text)",
            cursor: "pointer",
            background: "transparent",
            color: "var(--text)",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: "0.9rem",
            flexShrink: 0,
            transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.97)" }}
          onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)" }}
        >
          Buy Now
        </button>
      </div>

      {/* bottom padding for mobile sticky bar */}
      <div style={{ height: "80px" }} />
    </div>
  )
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  )
}