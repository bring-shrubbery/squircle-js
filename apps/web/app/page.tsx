import { Navbar } from "@/components/navbar";

import { ExamplesSection } from "./sections/ExamplesSection";
import { ExamplesSectionAsChildExample } from "./sections/ExamplesSectionAsChildExample";
import { ExampleSectionConstantSizeExample } from "./sections/ExamplesSectionConstantSizeExample";
import { ExamplesSectionDefaultSizeExample } from "./sections/ExamplesSectionDefaultSizeExample";
import { ExamplesSectionDynamicSizeExample } from "./sections/ExamplesSectionDynamicSizeExample";
import { FeaturesSection } from "./sections/FeaturesSection";
import { LicenseSection } from "./sections/LicenseSection";
import { LinksSection } from "./sections/LinksSection";
import { SquircleDemoSection } from "./sections/SquircleDemoSection";
import { UsageSection } from "./sections/UsageSection";
import { UsageSectionReactContent } from "./sections/UsageSectionReactContent";
import { UsageSectionSolidContent } from "./sections/UsageSectionSolidContent";
import { UsageSectionSvelteContent } from "./sections/UsageSectionSvelteContent";
import { UsageSectionVueContent } from "./sections/UsageSectionVueContent";

export default function Page() {
  return (
    <>
      <Navbar className="max-w-240" />
      <div className="px-4 sm:px-0">
        <SquircleDemoSection />
        <FeaturesSection />
        <UsageSection
          reactUsageContent={<UsageSectionReactContent />}
          solidUsageContent={<UsageSectionSolidContent />}
          svelteUsageContent={<UsageSectionSvelteContent />}
          vueUsageContent={<UsageSectionVueContent />}
        />
        <ExamplesSection
          asChildPropExample={<ExamplesSectionAsChildExample />}
          constantSizeExample={<ExampleSectionConstantSizeExample />}
          defaultSizeExample={<ExamplesSectionDefaultSizeExample />}
          dynamicSizeExample={<ExamplesSectionDynamicSizeExample />}
        />
        <LicenseSection />
        <LinksSection />
      </div>
    </>
  );
}
