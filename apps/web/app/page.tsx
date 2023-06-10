import { Navbar } from "@/components/navbar";
import { SquircleDemoSection } from "./SquircleDemoSection";
import { SquircleElement } from "@squircle-element/react";
import { UsageSection } from "./UsageSection";
import { ExamplesSection } from "./ExamplesSection";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { LicenseSection } from "./LicenseSection";
import { LinksSection } from "./LinksSection";

export default function Page() {
  return (
    <>
      <Navbar />
      <SquircleDemoSection />
      <FeaturesSection />
      <UsageSection />
      {/* <ExamplesSection /> */}
      {/* <HowItWorksSection /> */}
      <LicenseSection />
      <LinksSection />
    </>
  );
}
