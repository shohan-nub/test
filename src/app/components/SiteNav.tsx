"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useId, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import { brandLogo } from "./brand";

const primaryLinks = [
  { href: "/", label: "Studio" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
] as const;

function Navigation({ pathname }: { pathname: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  function warmRoute(href: string) {
    if (href !== pathname) router.prefetch(href);
  }

  function routeIntent(href: string) {
    return {
      prefetch: false as const,
      onPointerEnter: (event: PointerEvent<HTMLAnchorElement>) => {
        if (event.pointerType === "mouse") warmRoute(href);
      },
      onFocus: (event: FocusEvent<HTMLAnchorElement>) => {
        if (event.currentTarget.matches(":focus-visible")) warmRoute(href);
      },
    };
  }

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
      <Link className="wordmark" href="/" {...routeIntent("/")} aria-label="SparkLab home" onClick={() => setOpen(false)}>
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
          <Link key={href} href={href} {...routeIntent(href)} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>
            {label}
          </Link>
        ))}
      </nav>
      <Link className={`nav-cta${pathname === "/" ? " magnetic" : ""}`} href="/contact" {...routeIntent("/contact")} aria-current={pathname === "/contact" ? "page" : undefined} onClick={() => setOpen(false)}>
        Contact Us <span aria-hidden="true" className="arrow">↗</span>
      </Link>
    </header>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  return <Navigation key={pathname} pathname={pathname} />;
}
