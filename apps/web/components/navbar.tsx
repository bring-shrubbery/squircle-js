import Link from "next/link";
import { IoLogoGithub } from "react-icons/io5";
import { SITECONFIG } from "@/lib/siteconfig";

export const Navbar = () => {
  return (
    <nav className="border-gray-200 bg-white dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-6">
        <div className="line-clamp-1 w-0 p-2 text-white opacity-0 hover:text-black sm:w-auto sm:opacity-100">
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
