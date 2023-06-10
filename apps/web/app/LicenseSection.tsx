import { SITECONFIG } from "@/lib/siteconfig";
import Link from "next/link";

export const LicenseSection = () => {
  return (
    <div className="mx-auto container w-fit mb-36">
      <h2 className="font-semibold text-2xl mx-auto w-fit mb-4">
        License? MIT 🚀
      </h2>

      <span className="mx-auto">
        You can read the license{" "}
        <Link
          href={SITECONFIG.licenseLink}
          className="text-blue-600 font-medium hover:text-blue-400"
        >
          here
        </Link>
        .
      </span>
    </div>
  );
};
