import Link from "next/link";
import { SITECONFIG } from "@/lib/siteconfig";

export const ReviewsSection = () => {
  return (
    <div className="container mx-auto mb-36 w-fit">
      <h2 className="mx-auto mb-4 w-fit font-semibold text-2xl">
        {"Reviews 🎉"}
      </h2>

      <span className="mx-auto">
        Like this project? Leave review on{" "}
        <Link
          className="font-medium text-blue-600 hover:text-blue-400"
          data-umami-event="click"
          data-umami-event-id={"click_review"}
          data-umami-event-ref="producthunt"
          href={SITECONFIG.productHuntReviewLink}
        >
          Product Hunt
        </Link>
        .
      </span>
    </div>
  );
};
