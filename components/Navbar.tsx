"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badgePulse, setBadgePulse] = useState(false);
  const prevTotalRef = useRef(totalItems);

  // Scroll shadow
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Badge pulse on cart change
  useEffect(() => {
    if (totalItems !== prevTotalRef.current) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 500);
      prevTotalRef.current = totalItems;
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navBase: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: "#f0e8d0",
    borderBottom: scrolled ? "1px solid #d4cfc0" : "1px solid transparent",
    boxShadow: scrolled
      ? "0 4px 24px 0 rgba(74,222,128,0.10)"
      : "none",
    transition:
      "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s cubic-bezier(0.4,0,0.2,1)",
  };

  const navLinkStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: "0.9375rem",
    color: "#1a1a1a",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "12px",
    letterSpacing: "0.01em",
    transition:
      "color 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)",
    outline: "none",
  };

  function NavLink({
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
  }) {
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    return (
      <button
        onClick={onClick}
        style={{
          ...navLinkStyle,
          color: hovered || focused ? "#4ade80" : "#1a1a1a",
          backgroundColor:
            hovered || focused ? "rgba(74,222,128,0.10)" : "transparent",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label={label}
      >
        {label}
      </button>
    );
  }

  return (
    <>
      <header style={navBase} aria-label="Main navigation">
        <nav
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Left nav links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flex: 1,
            }}
          >
            <NavLink label="Shop" onClick={() => router.push("/shop")} />
            <NavLink label="Our Story" onClick={() => router.push("/")} />
          </div>

          {/* Center logo */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => router.push("/")}
              aria-label="Spherical Scoop – go to homepage"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "8px",
                outline: "none",
              }}
            >
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.75rem",
                  letterSpacing: "0.04em",
                  color: "#1a1a1a",
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                }}
              >
                Spherical Scoop
              </span>
            </button>
          </div>

          {/* Right: cart + hamburger */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            {/* Cart button */}
            <CartButton
              totalItems={totalItems}
              badgePulse={badgePulse}
              onClick={() => router.push("/shop")}
            />

            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "12px",
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
              }}
            >
              {mobileOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNavigate={(path) => {
          router.push(path);
          setMobileOpen(false);
        }}
      />

      {/* Spacer to offset fixed header */}
      <div style={{ height: "72px" }} aria-hidden="true" />
    </>
  );
}

function CartButton({
  totalItems,
  badgePulse,
  onClick,
}: {
  totalItems: number;
  badgePulse: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Shopping cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
      style={{
        position: "relative",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "12px",
        color: "#1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: hovered ? "rgba(74,222,128,0.10)" : "transparent",
        transition:
          "background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
        outline: "none",
        transform: hovered ? "scale(1.05)" : "scale(1)",
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>

      {totalItems > 0 && (
        <span
          style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            minWidth: "18px",
            height: "18px",
            borderRadius: "9999px",
            backgroundColor: "#e53e3e",
            color: "#ffffff",
            fontSize: "0.65rem",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            lineHeight: 1,
            transform: badgePulse ? "scale(1.3)" : "scale(1)",
            transition:
              "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: "0 0 0 2px #f0e8d0",
          }}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}

function MobileMenu({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}) {
  const links = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Our Story", path: "/" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 49,
        backgroundColor: "#f0e8d0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition:
          "opacity 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close menu"
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px",
          borderRadius: "12px",
          color: "#1a1a1a",
          outline: "none",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Logo in overlay */}
      <span
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontWeight: 700,
          fontSize: "2rem",
          color: "#1a1a1a",
          letterSpacing: "0.04em",
          marginBottom: "16px",
        }}
      >
        Spherical Scoop
      </span>

      {/* Nav links */}
      {links.map((link) => (
        <MobileNavLink
          key={link.label}
          label={link.label}
          onClick={() => onNavigate(link.path)}
          open={open}
        />
      ))}
    </div>
  );
}

function MobileNavLink({
  label,
  onClick,
  open,
}: {
  label: string;
  onClick: () => void;
  open: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      tabIndex={open ? 0 : -1}
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontWeight: 400,
        fontSize: "2.25rem",
        letterSpacing: "0.05em",
        color: hovered ? "#4ade80" : "#1a1a1a",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px 24px",
        borderRadius: "12px",
        outline: "none",
        transition:
          "color 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
      aria-label={label}
    >
      {label}
    </button>
  );
}