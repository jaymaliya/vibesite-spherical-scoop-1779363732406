"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#f0e8d0",
        borderTop: "1px solid #d4cfc0",
        paddingTop: "96px",
        paddingBottom: "48px",
      }}
      aria-label="Site footer"
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "48px",
            marginBottom: "64px",
          }}
        >
          {/* Brand column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontWeight: 700,
                fontSize: "1.875rem",
                letterSpacing: "0.04em",
                color: "#1a1a1a",
                lineHeight: 1,
              }}
            >
              Spherical Scoop
            </span>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "0.9375rem",
                color: "#1a1a1a",
                lineHeight: 1.7,
                maxWidth: "280px",
                margin: 0,
              }}
            >
              Pure geometry of flavor. Handcrafted pistachio ice cream,
              made with intention. Free shipping on orders above ₹799.
            </p>

            {/* Trust badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(74,222,128,0.12)",
                border: "1px solid rgba(74,222,128,0.30)",
                borderRadius: "9999px",
                padding: "6px 16px",
                width: "fit-content",
              }}
            >
              {/* India flag inline SVG approximation — map pin icon */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4ade80"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.8125rem",
                  color: "#1a1a1a",
                  letterSpacing: "0.02em",
                }}
              >
                Made in India
              </span>
            </div>

            {/* Social icons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "8px",
              }}
            >
              <SocialLink
                href="https://instagram.com"
                label="Follow Spherical Scoop on Instagram"
              >
                {/* Instagram SVG */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </SocialLink>

              <SocialLink
                href="https://twitter.com"
                label="Follow Spherical Scoop on Twitter"
              >
                {/* Twitter / X SVG */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 8v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </SocialLink>

              <SocialLink
                href="https://wa.me/"
                label="Chat with Spherical Scoop on WhatsApp"
              >
                {/* WhatsApp SVG */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Quick links column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontWeight: 700,
                fontSize: "1.125rem",
                letterSpacing: "0.08em",
                color: "#1a1a1a",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Quick Links
            </h3>
            <nav
              aria-label="Footer quick links"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                alignItems: "flex-start",
              }}
            >
              {quickLinks.map((link) => (
                <FooterNavLink
                  key={link.label}
                  label={link.label}
                  onClick={() => router.push(link.path)}
                />
              ))}
            </nav>
          </div>

          {/* Newsletter column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontWeight: 700,
                fontSize: "1.125rem",
                letterSpacing: "0.08em",
                color: "#1a1a1a",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Stay In The Loop
            </h3>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "0.9rem",
                color: "#1a1a1a",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              New flavors, early drops, and the occasional ice cream philosophy.
              No spam — ever.
            </p>

            {subscribed ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 16px",
                  backgroundColor: "rgba(74,222,128,0.15)",
                  border: "1px solid rgba(74,222,128,0.40)",
                  borderRadius: "12px",
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
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    color: "#1a1a1a",
                  }}
                >
                  You're on the list!
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                aria-label="Newsletter subscription form"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  aria-label="Email address for newsletter"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: "0.9375rem",
                    color: "#1a1a1a",
                    backgroundColor: "transparent",
                    border: `1.5px solid ${emailFocused ? "#4ade80" : "#d4cfc0"}`,
                    borderRadius: "12px",
                    padding: "12px 16px",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                    transition:
                      "border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
                <SubscribeButton />
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "#d4cfc0",
            marginBottom: "32px",
          }}
          aria-hidden="true"
        />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: "0.8125rem",
              color: "#1a1a1a",
              margin: 0,
              opacity: 0.7,
            }}
          >
            © {year} Spherical Scoop. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: "0.8125rem",
              color: "#1a1a1a",
              margin: 0,
              opacity: 0.7,
            }}
          >
            Secure payments via Razorpay &nbsp;·&nbsp; Made with care in India
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        borderRadius: "9999px",
        backgroundColor: hovered ? "rgba(74,222,128,0.15)" : "transparent",
        border: `1.5px solid ${hovered ? "#4ade80" : "#d4cfc0"}`,
        color: hovered ? "#4ade80" : "#1a1a1a",
        textDecoration: "none",
        transition:
          "background-color 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s cubic-bezier(0.4,0,0.2,1), color 0.2s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {children}
    </a>
  );
}

function FooterNavLink({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={label}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500,
        fontSize: "0.9375rem",
        color: hovered ? "#4ade80" : "#1a1a1a",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px 0",
        textAlign: "left",
        outline: "none",
        transition:
          "color 0.2s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {label}
    </button>
  );
}

function SubscribeButton() {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <button
      type="submit"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      aria-label="Subscribe to newsletter"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 600,
        fontSize: "0.9375rem",
        color: "#1a1a1a",
        backgroundColor: "#4ade80",
        border: "none",
        borderRadius: "12px",
        padding: "12px 24px",
        cursor: "pointer",
        width: "100%",
        outline: "none",
        boxShadow: hovered
          ? "0 8px 24px 0 rgba(74,222,128,0.35)"
          : "0 2px 8px 0 rgba(74,222,128,0.20)",
        transform: active ? "scale(0.98)" : hovered ? "scale(1.02)" : "scale(1)",
        transition:
          "transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      Subscribe
    </button>
  );
}