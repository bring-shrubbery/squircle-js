"use client";

import { useAtom } from "jotai";
import Link from "next/link";
import { IoLogoGithub } from "react-icons/io5";
import { LANGUAGE_SELECTOR_ATOM } from "@/lib/atoms";
import { SITECONFIG } from "@/lib/siteconfig";

export const Navbar = () => {
  const [language] = useAtom<"react" | "svelte">(LANGUAGE_SELECTOR_ATOM);

  return (
    <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between p-6">
      <div className="font-mono font-semibold text-2xl">
        {`@squircle-js/${language}`}
      </div>

      <Link className="block" href={SITECONFIG.githubLink}>
        <IoLogoGithub size={32} />
      </Link>
    </nav>
  );
};
