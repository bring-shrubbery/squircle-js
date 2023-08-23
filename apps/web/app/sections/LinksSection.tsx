import { QuassumIcon } from "@/components/quassum.icon";
import { SITECONFIG } from "@/lib/siteconfig";
import Link from "next/link";
import { IoLogoGithub, IoCash, IoLogoLinkedin } from "react-icons/io5";

export const LinksSection = () => {
  return (
    <div className="mx-auto container w-fit mb-36">
      <h2 className="font-semibold text-2xl mx-auto w-fit mb-16">
        Build with 💙 by{" "}
        <Link
          href={SITECONFIG.antoniGithubLink}
          className="hover:text-blue-600 transition-colors"
        >
          Antoni
        </Link>
      </h2>

      <div className="flex flex-col sm:flex-row gap-8">
        <Link
          href={SITECONFIG.antoniGithubLink}
          className="mx-auto flex flex-col items-center gap-2"
        >
          <IoLogoGithub size={36} />
          <span className="font-medium">Github 👩‍💻</span>
        </Link>

        <Link
          href={SITECONFIG.linkedinLink}
          className="mx-auto flex flex-col items-center gap-2"
        >
          <IoLogoLinkedin size={36} />
          <span className="font-medium">Hire me? 😏</span>
        </Link>

        <Link
          href={SITECONFIG.sponsorLink}
          className="mx-auto flex flex-col items-center gap-2"
        >
          <IoCash size={36} />
          <span className="font-medium">Sponsor ❤️</span>
        </Link>

        <Link
          href={SITECONFIG.quassumLink}
          className="mx-auto flex flex-col items-center gap-2"
        >
          <QuassumIcon className="w-9 h-9" />
          <span className="font-medium">Quassum 🖤</span>
        </Link>
      </div>
    </div>
  );
};
