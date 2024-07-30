import Link from "next/link";
import { SITECONFIG } from "@/lib/siteconfig";

export const ReviewsSection = () => {
  return (
    <div className="container mx-auto mb-36 w-fit">
      <h2 className="mx-auto mb-4 w-fit text-2xl font-semibold">
        {"Reviews 🎉"}
      </h2>

      <span className="mx-auto">
        Like this project? Leave review on{" "}
        <Link
          href={SITECONFIG.productHuntReviewLink}
          className="font-medium text-blue-600 hover:text-blue-400"
        >
          Product Hunt
        </Link>
        .
      </span>
    </div>
  );
};
