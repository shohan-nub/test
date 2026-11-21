"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useRef, useState } from "react";
import { brandLogo } from "./brand";

const primaryLinks = [
  { href: "/", label: "Studio" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
] as const;

function Navigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  return (
    <header
      className="nav-shell site-navigation"
      onBlur={event => {
        if (open && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={event => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <Link className="wordmark" href="/" aria-label="SparkLab home" onClick={() => setOpen(false)}>
        <Image className="navbar-brand-logo" {...brandLogo} alt="SparkLab" loading="eager" sizes="(max-width: 640px) 108px, 132px" />
      </Link>
      <button
        ref={toggle}
        type="button"
        className="mobile-menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
      >
        Menu <span aria-hidden="true">{open ? "×" : "↓"}</span>
      </button>
      <nav id={menuId} className="main-nav" data-open={open} aria-label="Main navigation">
        {primaryLinks.map(({ href, label }) => (
          <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>
            {label}
          </Link>
        ))}
      </nav>
      <Link className={`nav-cta${pathname === "/" ? " magnetic" : ""}`} href="/contact" aria-current={pathname === "/contact" ? "page" : undefined} onClick={() => setOpen(false)}>
        Contact Us <span aria-hidden="true" className="arrow">↗</span>
      </Link>
    </header>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  return <Navigation key={pathname} pathname={pathname} />;
}
