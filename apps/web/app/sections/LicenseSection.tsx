import Link from "next/link";
import { SITECONFIG } from "@/lib/siteconfig";

export const LicenseSection = () => {
  return (
    <div className="container mx-auto mb-36 w-fit">
      <h2 className="mx-auto mb-4 w-fit font-semibold text-2xl">
        License? MIT 🚀
      </h2>

      <span className="mx-auto">
        You can read the license{" "}
        <Link
          className="font-medium text-blue-600 hover:text-blue-400"
          data-umami-event="click"
          data-umami-event-id={"click_license"}
          data-umami-event-ref="license"
          href={SITECONFIG.licenseLink}
        >
          here
        </Link>
        .
      </span>
    </div>
  );
};
