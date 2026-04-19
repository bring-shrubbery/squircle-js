"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { DocsFrontmatter } from "@/lib/mdx";

const GROUP_ORDER = ["react", "solid", "svelte"];
const GROUP_LABELS: Record<string, string> = {
  react: "React",
  solid: "Solid",
  svelte: "Svelte",
};

function groupDocs(items: DocsFrontmatter[]) {
  const ungrouped: DocsFrontmatter[] = [];
  const byGroup = new Map<string, DocsFrontmatter[]>();

  for (const item of items) {
    if (item.group) {
      const list = byGroup.get(item.group) ?? [];
      list.push(item);
      byGroup.set(item.group, list);
    } else {
      ungrouped.push(item);
    }
  }

  for (const list of byGroup.values()) {
    list.sort((a, b) => a.order - b.order);
  }
  ungrouped.sort((a, b) => a.order - b.order);

  const orderedGroups: {
    key: string;
    label: string;
    items: DocsFrontmatter[];
  }[] = [];
  for (const key of GROUP_ORDER) {
    const groupItems = byGroup.get(key);
    if (groupItems) {
      orderedGroups.push({
        key,
        label: GROUP_LABELS[key] ?? key,
        items: groupItems,
      });
    }
  }
  for (const [key, groupItems] of byGroup) {
    if (!GROUP_ORDER.includes(key)) {
      orderedGroups.push({
        key,
        label: GROUP_LABELS[key] ?? key,
        items: groupItems,
      });
    }
  }

  return { ungrouped, groups: orderedGroups };
}

export const DocsSidebar = ({ items }: { items: DocsFrontmatter[] }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { ungrouped, groups } = groupDocs(items);

  const renderLink = (item: DocsFrontmatter) => {
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
  };

  const navLinks = (
    <>
      <Link className="mb-4 block font-semibold text-lg" href="/docs">
        Docs
      </Link>
      {ungrouped.map(renderLink)}
      {groups.map((group) => (
        <div className="pt-4" key={group.key}>
          <div className="mb-1 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
            {group.label}
          </div>
          {group.items.map(renderLink)}
        </div>
      ))}
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="mb-4 flex items-center gap-2 font-medium text-sm md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>{isOpen ? "Hide" : "Show"} menu</span>
      </button>

      {/* Mobile nav */}
      {isOpen && <nav className="mb-6 space-y-1 md:hidden">{navLinks}</nav>}

      {/* Desktop sidebar */}
      <nav className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-8 space-y-1">{navLinks}</div>
      </nav>
    </>
  );
};
