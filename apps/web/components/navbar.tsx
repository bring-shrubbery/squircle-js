import { SITECONFIG } from "@/lib/siteconfig";
import Link from "next/link";

import { IoLogoGithub } from "react-icons/io5";

export const Navbar = () => {
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-6">
        <div className="w-0 opacity-0 sm:opacity-100 sm:w-auto line-clamp-1 p-2 text-white hover:text-black">
          {"Yes, I really didn't put anything in this corner."}
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
