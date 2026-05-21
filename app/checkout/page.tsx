"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap";

const REALISTIC_PRICE = 299;

function getPrice(price: number) {
  return price === 0 ? REALISTIC_PRICE : price;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const subtotal = cart.reduce(
    (sum: number, item: any) => sum + getPrice(item.price) * item.qty,
    0
  );
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
    };
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
    document.querySelectorAll(".reveal").forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(24px)";
      (el as HTMLElement).style.transition =
        "opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address.";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit phone number.";
    if (!form.address.trim()) newErrors.address = "Address is required.";
    if (!form.city.trim()) newErrors.city = "City is required.";
    if (!form.state.trim()) newErrors.state = "State is required.";
    if (!form.pin.trim() || !/^\d{6}$/.test(form.pin))
      newErrors.pin = "Enter a valid 6-digit PIN code.";
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const order = await res.json();

      const options = {
        key: "rzp_test_",
        amount: order.amount,
        currency: "INR",
        name: "Spherical Scoop",
        description: "Pure geometry of flavor",
        order_id: order.id,
        handler: () => {
          clearCart();
          router.push("/");
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#4ade80" },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Payment gateway not loaded. Please try again.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle = (field: string) => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${errors[field] ? "#ef4444" : "#c8c0a8"}`,
    background: "#faf7f0",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1rem",
    color: "#1a1a1a",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxSizing: "border-box" as const,
  });

  const labelStyle = {
    display: "block",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: "0.875rem",
    color: "#1a1a1a",
    marginBottom: "6px",
    letterSpacing: "0.01em",
  };

  const errorStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.8rem",
    color: "#ef4444",
    marginTop: "4px",
  };

  if (cart.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f0e8d0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          padding: "48px 24px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#4ade8020",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4ade80"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "#1a1a1a",
            letterSpacing: "0.04em",
            textAlign: "center",
            margin: 0,
          }}
        >
          Your cart is empty
        </h2>
        <p
          style={{
            color: "#a09880",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            textAlign: "center",
            maxWidth: "360px",
            margin: 0,
          }}
        >
          Looks like you haven't added any scoops yet. Explore our flavors and
          find your perfect match.
        </p>
        <button
          onClick={() => router.push("/shop")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.02)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={(e) =>
            (e.currentTarget.style.transform = "scale(0.98)")
          }
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          style={{
            padding: "16px 40px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            background: "#4ade80",
            color: "#1a1a1a",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: "1rem",
            letterSpacing: "0.01em",
            boxShadow: "0 10px 30px -10px #4ade8060",
            transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease",
          }}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0e8d0",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#f0e8d0",
          borderBottom: "1px solid #e0d8c0",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "20px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => router.push("/")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#a09880",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 500,
              padding: "8px 0",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a1a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#a09880")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.6rem",
              letterSpacing: "0.08em",
              color: "#1a1a1a",
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            Spherical Scoop
          </div>

          <div style={{ width: "60px" }} />
        </div>
      </header>

      {/* Page Title */}
      <div
        className="reveal"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "64px 32px 40px",
        }}
      >
        <span
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontWeight: 600,
            color: "#4ade80",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Secure Checkout
        </span>
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            letterSpacing: "0.04em",
            color: "#1a1a1a",
            margin: "8px 0 0",
            lineHeight: 1.05,
          }}
        >
          Complete Your Order
        </h1>
      </div>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px 96px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
            gap: "40px",
            alignItems: "flex-start",
          }}
        >
          {/* LEFT: Form */}
          <div className="reveal">
            <form onSubmit={handleSubmit} noValidate>
              <div
                style={{
                  background: "#faf7f0",
                  borderRadius: "20px",
                  padding: "40px",
                  boxShadow: "0 8px 40px -12px #4ade8025",
                  border: "1px solid #e8e0cc",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.8rem",
                    letterSpacing: "0.04em",
                    color: "#1a1a1a",
                    marginBottom: "32px",
                    marginTop: 0,
                  }}
                >
                  Delivery Details
                </h2>

                {/* Full Name */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={labelStyle} htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Arjun Sharma"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#4ade80";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px #4ade8025";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.name
                        ? "#ef4444"
                        : "#c8c0a8";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    style={inputStyle("name")}
                  />
                  {errors.name && (
                    <p style={errorStyle}>{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={labelStyle} htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="arjun@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#4ade80";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px #4ade8025";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.email
                        ? "#ef4444"
                        : "#c8c0a8";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    style={inputStyle("email")}
                  />
                  {errors.email && (
                    <p style={errorStyle}>{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={labelStyle} htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#4ade80";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px #4ade8025";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.phone
                        ? "#ef4444"
                        : "#c8c0a8";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    style={inputStyle("phone")}
                  />
                  {errors.phone && (
                    <p style={errorStyle}>{errors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={labelStyle} htmlFor="address">
                    Full Address
                  </label>
                  <textarea
                    id="address"
                    placeholder="House No, Street, Locality..."
                    rows={3}
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#4ade80";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px #4ade8025";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.address
                        ? "#ef4444"
                        : "#c8c0a8";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    style={{
                      ...inputStyle("address"),
                      resize: "vertical",
                      minHeight: "96px",
                    }}
                  />
                  {errors.address && (
                    <p style={errorStyle}>{errors.address}</p>
                  )}
                </div>

                {/* City + State Row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <div>
                    <label style={labelStyle} htmlFor="city">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="Mumbai"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#4ade80";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px #4ade8025";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.city
                          ? "#ef4444"
                          : "#c8c0a8";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      style={inputStyle("city")}
                    />
                    {errors.city && (
                      <p style={errorStyle}>{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="state">
                      State
                    </label>
                    <input
                      id="state"
                      type="text"
                      placeholder="Maharashtra"
                      value={form.state}
                      onChange={(e) =>
                        setForm({ ...form, state: e.target.value })
                      }
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#4ade80";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px #4ade8025";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = errors.state
                          ? "#ef4444"
                          : "#c8c0a8";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      style={inputStyle("state")}
                    />
                    {errors.state && (
                      <p style={errorStyle}>{errors.state}</p>
                    )}
                  </div>
                </div>

                {/* PIN */}
                <div style={{ marginBottom: "8px" }}>
                  <label style={labelStyle} htmlFor="pin">
                    PIN Code
                  </label>
                  <input
                    id="pin"
                    type="text"
                    placeholder="400001"
                    maxLength={6}
                    value={form.pin}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        pin: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#4ade80";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px #4ade8025";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.pin
                        ? "#ef4444"
                        : "#c8c0a8";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    style={inputStyle("pin")}
                  />
                  {errors.pin && (
                    <p style={errorStyle}>{errors.pin}</p>
                  )}
                </div>
              </div>

              {/* Security note */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "20px",
                  color: "#a09880",
                  fontSize: "0.85rem",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Your payment is encrypted and secure via Razorpay
              </div>

              {/* Submit button — hidden on desktop, visible on mobile */}
              <button
                type="submit"
                disabled={isSubmitting}
                onMouseEnter={(e) =>
                  !isSubmitting &&
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.98)")
                }
                onMouseUp={(e) =>
                  !isSubmitting &&
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                style={{
                  display: "none",
                  width: "100%",
                  marginTop: "24px",
                  padding: "18px 40px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  background: isSubmitting ? "#a0d4b0" : "#4ade80",
                  color: "#1a1a1a",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  letterSpacing: "0.02em",
                  boxShadow: "0 10px 30px -10px #4ade8060",
                  transition:
                    "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease",
                }}
                id="mobile-submit-btn"
              >
                {isSubmitting ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN")}`}
              </button>
            </form>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="reveal" style={{ position: "sticky", top: "100px" }}>
            <div
              style={{
                background: "#faf7f0",
                borderRadius: "20px",
                padding: "40px",
                boxShadow: "0 8px 40px -12px #4ade8025",
                border: "1px solid #e8e0cc",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.8rem",
                  letterSpacing: "0.04em",
                  color: "#1a1a1a",
                  marginBottom: "28px",
                  marginTop: 0,
                }}
              >
                Order Summary
              </h2>

              {/* Cart Items */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  marginBottom: "28px",
                }}
              >
                {cart.map((item: any) => {
                  const itemPrice = getPrice(item.price);
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "#e8e0cc",
                        }}
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.6s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            color: "#1a1a1a",
                            margin: "0 0 4px",
                            textTransform: "capitalize",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.85rem",
                            color: "#a09880",
                            margin: 0,
                          }}
                        >
                          Qty: {item.qty}
                        </p>
                      </div>
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "#1a1a1a",
                          margin: 0,
                          flexShrink: 0,
                        }}
                      >
                        ₹{(itemPrice * item.qty).toLocaleString("en-IN")}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "#e0d8c0",
                  marginBottom: "24px",
                }}
              />

              {/* Shipping threshold badge */}
              {subtotal <= 500 && (
                <div
                  style={{
                    background: "#4ade8015",
                    border: "1px solid #4ade8040",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.85rem",
                      color: "#1a1a1a",
                      margin: 0,
                    }}
                  >
                    Add ₹{(500 - subtotal).toLocaleString("en-IN")} more for{" "}
                    <strong>FREE shipping</strong>
                  </p>
                </div>
              )}

              {subtotal > 500 && (
                <div
                  style={{
                    background: "#4ade8015",
                    border: "1px solid #4ade8040",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.85rem",
                      color: "#1a1a1a",
                      margin: 0,
                    }}
                  >
                    You've unlocked <strong>FREE shipping!</strong> 🎉
                  </p>
                </div>
              )}

              {/* Price Breakdown */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.95rem",
                      color: "#a09880",
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.95rem",
                      color: "#1a1a1a",
                      fontWeight: 500,
                    }}
                  >
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.95rem",
                      color: "#a09880",
                    }}
                  >
                    Shipping
                  </span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: shipping === 0 ? "#4ade80" : "#1a1a1a",
                    }}
                  >
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div
                style={{
                  height: "1px",
                  background: "#e0d8c0",
                  marginBottom: "20px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "32px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.3rem",
                    letterSpacing: "0.04em",
                    color: "#1a1a1a",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.6rem",
                    letterSpacing: "0.04em",
                    color: "#1a1a1a",
                  }}
                >
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={handleSubmit as any}
                disabled={isSubmitting}
                onMouseEnter={(e) =>
                  !isSubmitting &&
                  ((e.currentTarget.style.transform = "scale(1.02)"),
                  (e.currentTarget.style.boxShadow =
                    "0 16px 40px -10px #4ade8070"))
                }
                onMouseLeave={(e) => (
                  (e.currentTarget.style.transform = "scale(1)"),
                  (e.currentTarget.style.boxShadow =
                    "0 10px 30px -10px #4ade8060")
                )}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.98)")
                }
                onMouseUp={(e) =>
                  !isSubmitting &&
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                style={{
                  width: "100%",
                  padding: "18px 40px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  background: isSubmitting ? "#a0d4b0" : "#4ade80",
                  color: "#1a1a1a",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  letterSpacing: "0.02em",
                  boxShadow: "0 10px 30px -10px #4ade8060",
                  transition:
                    "transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        animation: "spin 1s linear infinite",
                      }}
                    >
                      <line x1="12" y1="2" x2="12" y2="6" />
                      <line x1="12" y1="18" x2="12" y2="22" />
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                      <line x1="2" y1="12" x2="6" y2="12" />
                      <line x1="18" y1="12" x2="22" y2="12" />
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    Place Order · ₹{total.toLocaleString("en-IN")}
                  </>
                )}
              </button>

              {/* Trust Signals */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "24px",
                  marginTop: "20px",
                  flexWrap: "wrap",
                }}
              >
                {[
                  {
                    icon: (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#a09880"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ),
                    label: "Secure Payment",
                  },
                  {
                    icon: (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#a09880"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    ),
                    label: "Fast Delivery",
                  },
                  {
                    icon: (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#a09880"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ),
                    label: "Made in India",
                  },
                ].map((t) => (
                  <div
                    key={t.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.78rem",
                      color: "#a09880",
                    }}
                  >
                    {t.icon}
                    {t.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Spin keyframes injected via a style tag workaround — using CSS variable trick via global */}
      <div
        aria-hidden
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <svg>
          <defs>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </defs>
        </svg>
      </div>
    </div>
  );
}