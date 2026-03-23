"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { DocsFrontmatter } from "@/lib/mdx";

export const DocsSidebar = ({ items }: { items: DocsFrontmatter[] }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = (
    <>
      <Link
        className="mb-4 block font-semibold text-lg"
        href="/docs"
      >
        Docs
      </Link>
      {items.map((item) => {
        const href = `/docs/${item.slug}`;
        const isActive = pathname === href;
        return (
          <Link
            className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
              isActive
                ? "bg-muted font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
            href={href}
            key={item.slug}
            onClick={() => setIsOpen(false)}
          >
            {item.title}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="mb-4 flex items-center gap-2 text-sm font-medium md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>{isOpen ? "Hide" : "Show"} menu</span>
      </button>

      {/* Mobile nav */}
      {isOpen && (
        <nav className="mb-6 space-y-1 md:hidden">{navLinks}</nav>
      )}

      {/* Desktop sidebar */}
      <nav className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-8 space-y-1">{navLinks}</div>
      </nav>
    </>
  );
};
