import { useState } from "react";
import logoMaj from "../assets/logo-maj.png";

const LINKS = ["map", "shops", "services", "experiences"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-30 bg-linear-to-b from-black to-transparent">
      <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 py-5 md:px-16 md:py-6">
        <a href="#top" className="shrink-0">
          <img src={logoMaj} alt="MAJ — House of Fun" className="h-10 w-auto md:h-14" />
        </a>

        <nav className="hidden items-center gap-10 border-x border-white/20 px-10 py-2 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link}
              href={`#${link}`}
              className="font-display text-sm font-light uppercase tracking-wide text-white/90 transition-colors hover:text-gold"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a href="#contact" className="text-right">
            <span className="block font-display text-sm font-light uppercase tracking-wide text-gold md:text-base">
              Contact
            </span>
            <span className="block font-body text-[10px] text-white/70 md:text-xs">
              open daily: 8:30 – 24:00h
            </span>
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 shrink-0 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span
              className={`h-px w-6 bg-white transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-6 bg-white transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col items-center gap-6 border-t border-white/10 bg-black py-8 lg:hidden">
          {LINKS.map((link) => (
            <a
              key={link}
              href={`#${link}`}
              onClick={() => setOpen(false)}
              className="font-display text-lg font-light uppercase tracking-wide text-white/90 transition-colors hover:text-gold"
            >
              {link}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
