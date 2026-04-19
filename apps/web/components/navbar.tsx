import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoGithub } from "react-icons/io5";
import { SITECONFIG } from "@/lib/siteconfig";

export const Navbar = ({ className }: { className?: string }) => {
  return (
    <nav
      className={`mx-auto flex flex-wrap items-center justify-between p-6 ${className ?? "max-w-7xl"}`}
    >
      <Link className="font-mono font-semibold text-2xl" href="/">
        squircle.js
      </Link>

      <div className="flex items-center gap-4">
        <Link className="block" href={SITECONFIG.twitterLink}>
          <FaXTwitter size={28} />
        </Link>
        <Link className="block" href={SITECONFIG.githubLink}>
          <IoLogoGithub size={32} />
        </Link>
      </div>
    </nav>
  );
};
