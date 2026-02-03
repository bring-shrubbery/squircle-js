import Link from "next/link";
import { IoLogoGithub } from "react-icons/io5";
import { SITECONFIG } from "@/lib/siteconfig";

export const Navbar = () => {
  return (
    <nav className="border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between p-6">
        <div className="line-clamp-1 font-bold font-mono text-2xl">
          @squircle.js
        </div>

        <div className="w-auto">
          <Link href={SITECONFIG.githubLink}>
            <IoLogoGithub size={32} />
          </Link>
        </div>
      </div>
    </nav>
  );
};
