"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { navLinks, type SectionId } from "@/data/navigation";
import { profile } from "@/data/profile";
import ResumeLinks from "@/components/ResumeLinks";

/** Desktop links appear from this width; below it the hamburger menu is used. */
const DESKTOP_QUERY = "(min-width: 1024px)";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Navbar({ resumeAvailable = false }: { resumeAvailable?: boolean }) {
  const [active, setActive] = useState<SectionId>("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const menuId = useId();

  /* ---------- Scrolled state (blur + border) and bottom-of-page fallback ---------- */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      // The last section can be too short to cross the detection line; treat the page end as Contact.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        setActive("contact");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- Active section via IntersectionObserver ---------- */
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);

    // A thin detection band ~35% down the viewport: whichever section crosses it is active.
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id as SectionId);
      },
      { rootMargin: "-35% 0px -64% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* ---------- Mobile menu: close helpers ---------- */
  const closeMenu = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  // Escape key, click outside, and switching to desktop width all close the menu.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu(true);
    };
    const onPointer = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeMenu(false);
    };
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onResize = () => {
      if (mq.matches) closeMenu(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    mq.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      mq.removeEventListener("change", onResize);
    };
  }, [open, closeMenu]);

  // Lock background scrolling while the menu is open, and move focus into it.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  /* ---------- Mobile link selection ---------- */
  // Close first (releasing the scroll lock), then scroll and record the hash so back/forward work.
  const onMobileLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => {
      document.documentElement.style.overflow = "";
      const target = document.getElementById(id);
      if (!target) return;
      if (window.location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
      target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      setActive(id);
    });
  };

  // Transparent over the hero; translucent + blurred once scrolled; near-opaque while the menu is open.
  const surface = open
    ? "border-line bg-bg/95 backdrop-blur-md"
    : scrolled
      ? "border-line bg-bg/80 backdrop-blur-md"
      : "border-transparent bg-transparent";

  return (
    <header
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 motion-reduce:transition-none ${surface}`}
    >
      <a
        href="#main"
        className="sr-only rounded-full bg-fg px-5 py-2.5 text-[14px] font-medium text-bg focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-10"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:h-[88px] lg:px-[72px]"
      >
        <a
          href="#home"
          className="text-[26px] font-bold tracking-[-0.04em] text-fg lg:text-[30px]"
          aria-label={`${profile.firstName} ${profile.lastName}, home`}
        >
          {profile.initials}.
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-10 lg:flex xl:gap-12">
        <ul className="hidden items-center gap-10 lg:flex xl:gap-12">
          {navLinks.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative py-2 text-[15px] transition-colors motion-reduce:transition-none ${
                    isActive ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-px bg-fg transition-opacity motion-reduce:transition-none ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
        <ResumeLinks available={resumeAvailable} variant="nav" />
        </div>

        {/* Mobile / tablet menu button */}
        <button
          ref={buttonRef}
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-fg lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden="true" className="relative block h-3 w-5">
            <span
              className={`absolute left-0 h-px w-5 bg-current transition-transform duration-300 motion-reduce:transition-none ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-5 bg-current transition-transform duration-300 motion-reduce:transition-none ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile / tablet menu panel */}
      <div
        id={menuId}
        inert={!open}
        className={`grid border-line transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          open ? "grid-rows-[1fr] border-t opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="px-6 pb-8 pt-2 sm:px-10">
            {navLinks.map((link, i) => {
              const isActive = active === link.id;
              return (
                <li key={link.id} className="border-b border-line last:border-b-0">
                  <a
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={`#${link.id}`}
                    aria-current={isActive ? "location" : undefined}
                    onClick={(e) => onMobileLinkClick(e, link.id)}
                    className={`flex items-center justify-between py-5 text-[22px] ${
                      isActive ? "text-fg" : "text-muted"
                    }`}
                  >
                    {link.label}
                    {isActive && <span aria-hidden="true" className="size-1.5 rounded-full bg-fg" />}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="px-6 pb-8 sm:px-10 [&:empty]:hidden">
            <ResumeLinks available={resumeAvailable} variant="menu" onNavigate={() => setOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  );
}
