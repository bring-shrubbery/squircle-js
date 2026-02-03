import Link from "next/link";
import { IoLogoGithub, IoLogoTwitter } from "react-icons/io5";
import { QuassumIcon } from "@/components/quassum.icon";
import { SITECONFIG } from "@/lib/siteconfig";
import { FaProductHunt } from "react-icons/fa";

export const LinksSection = () => {
  return (
    <div className="container mx-auto mb-36 w-fit">
      <h2 className="mx-auto mb-16 w-fit font-semibold text-2xl">
        Build with 💙 by{" "}
        <Link
          className="transition-colors hover:text-blue-600"
          data-umami-event="click"
          data-umami-event-id={"click_author"}
          data-umami-event-ref="github"
          href={SITECONFIG.antoniGithubLink}
        >
          {"Antoni"}
        </Link>
      </h2>

      <div className="flex flex-col gap-8 sm:flex-row">
        <Link
          className="mx-auto flex flex-col items-center gap-2"
          data-umami-event="click"
          data-umami-event-id={"click_author"}
          data-umami-event-ref="github"
          href={SITECONFIG.antoniGithubLink}
        >
          <IoLogoGithub size={36} />
          <span className="font-medium">{"Github 👩‍💻"}</span>
        </Link>

        <Link
          className="mx-auto flex flex-col items-center gap-2"
          data-umami-event="click"
          data-umami-event-id={"click_author"}
          data-umami-event-ref="twitter"
          href={SITECONFIG.twitterLink}
        >
          <IoLogoTwitter size={36} />
          <div className="max-w-24 text-center font-medium">
            {"Follow on Twitter? 😏"}
          </div>
        </Link>

        <Link
          className="mx-auto flex flex-col items-center gap-2"
          data-umami-event="click"
          data-umami-event-id={"click_author"}
          data-umami-event-ref="sponsor"
          href={SITECONFIG.producthuntLink}
        >
          <FaProductHunt size={36} />
          <div className="max-w-24 text-center font-medium">
            {"Follow on ProductHunt"}
          </div>
        </Link>

        <Link
          className="mx-auto flex flex-col items-center gap-2"
          data-umami-event="click"
          data-umami-event-id={"click_author"}
          data-umami-event-ref="quassum"
          href={SITECONFIG.quassumLink}
        >
          <QuassumIcon className="h-9 w-9" />
          <span className="font-medium">{"Quassum 🖤"}</span>
        </Link>
      </div>
    </div>
  );
};
