import Link from "next/link";
import { QuassumIcon } from "@/components/quassum.icon";
import { SITECONFIG } from "@/lib/siteconfig";
import { IoCash, IoLogoGithub, IoLogoTwitter } from "react-icons/io5";

export const LinksSection = () => {
  return (
    <div className="container mx-auto mb-36 w-fit">
      <h2 className="mx-auto mb-16 w-fit text-2xl font-semibold">
        Build with 💙 by{" "}
        <Link
          href={SITECONFIG.antoniGithubLink}
          className="transition-colors hover:text-blue-600"
        >
          Antoni
        </Link>
      </h2>

      <div className="flex flex-col gap-8 sm:flex-row">
        <Link
          href={SITECONFIG.antoniGithubLink}
          className="mx-auto flex flex-col items-center gap-2"
        >
          <IoLogoGithub size={36} />
          <span className="font-medium">Github 👩‍💻</span>
        </Link>

        <Link
          href={SITECONFIG.twitterLink}
          className="mx-auto flex flex-col items-center gap-2"
        >
          <IoLogoTwitter size={36} />
          <span className="font-medium">Follow me? 😏</span>
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
          <QuassumIcon className="h-9 w-9" />
          <span className="font-medium">Quassum 🖤</span>
        </Link>
      </div>
    </div>
  );
};
