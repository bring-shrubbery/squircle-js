import { Navbar } from "@/components/navbar";

import { ExamplesSection } from "./sections/ExamplesSection";
import { ExamplesSectionAsChildExample } from "./sections/ExamplesSectionAsChildExample";
import { ExampleSectionConstantSizeExample } from "./sections/ExamplesSectionConstantSizeExample";
import { ExamplesSectionDefaultSizeExample } from "./sections/ExamplesSectionDefaultSizeExample";
import { ExamplesSectionDynamicSizeExample } from "./sections/ExamplesSectionDynamicSizeExample";
import { FeaturesSection } from "./sections/FeaturesSection";
import { LicenseSection } from "./sections/LicenseSection";
import { LinksSection } from "./sections/LinksSection";
import { ReviewsSection } from "./sections/ReviewsSection";
import { SquircleDemoSection } from "./sections/SquircleDemoSection";
import { UsageSection } from "./sections/UsageSection";
import { UsageSectionReactContent } from "./sections/UsageSectionReactContent";

export default function Page() {
  return (
    <>
      <Navbar />
      <SquircleDemoSection />
      <FeaturesSection />
      <UsageSection reactUsageContent={<UsageSectionReactContent />} />
      <ExamplesSection
        constantSizeExample={<ExampleSectionConstantSizeExample />}
        defaultSizeExample={<ExamplesSectionDefaultSizeExample />}
        asChildPropExample={<ExamplesSectionAsChildExample />}
        dynamicSizeExample={<ExamplesSectionDynamicSizeExample />}
      />
      {/* <HowItWorksSection /> */}
      <LicenseSection />
      <ReviewsSection />
      <LinksSection />
    </>
  );
}
