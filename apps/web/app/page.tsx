import { Navbar } from "@/components/navbar";
import { SquircleDemoSection } from "./sections/SquircleDemoSection";
import { UsageSection } from "./sections/UsageSection";
import { ExamplesSection } from "./sections/ExamplesSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { LicenseSection } from "./sections/LicenseSection";
import { LinksSection } from "./sections/LinksSection";

export default function Page() {
  return (
    <>
      <Navbar />
      <SquircleDemoSection />
      <FeaturesSection />
      <UsageSection />
      <ExamplesSection />
      {/* <HowItWorksSection /> */}
      <LicenseSection />
      <LinksSection />
    </>
  );
}
