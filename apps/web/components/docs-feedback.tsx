"use client";

import { FeedbackProvider, InlineFeedback } from "@futurebase/feedback/react";

export const DocsFeedback = () => {
  return (
    <FeedbackProvider slug="squircle">
      <div className="mt-12 border-t pt-8">
        <h3 className="mb-3 font-semibold text-lg">
          {"Was this page helpful?"}
        </h3>
        <InlineFeedback fields={["text"]} />
      </div>
    </FeedbackProvider>
  );
};
