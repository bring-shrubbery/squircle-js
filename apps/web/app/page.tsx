import { Navbar } from "@/components/navbar";
import { SquircleDemoSection } from "./sections/SquircleDemoSection";
import { UsageSection } from "./sections/UsageSection";
import { ExamplesSection } from "./sections/ExamplesSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { LicenseSection } from "./sections/LicenseSection";
import { LinksSection } from "./sections/LinksSection";
import { UsageSectionReactContent } from "./sections/UsageSectionReactContent";
import { ExampleSectionConstantSizeExample } from "./sections/ExamplesSectionConstantSizeExample";
import { ExamplesSectionDefaultSizeExample } from "./sections/ExamplesSectionDefaultSizeExample";

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
      />
      {/* <HowItWorksSection /> */}
      <LicenseSection />
      <LinksSection />
    </>
  );
}
