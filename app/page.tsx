import { ChallengesSection } from "@/components/challenges/ChallengesSection";
import { Hero } from "@/components/hero/Hero";
import { InsightsSection } from "@/components/insights/InsightsSection";
import { LearningSection } from "@/components/learning/LearningSection";
import { LandingMotionController } from "@/components/motion/LandingMotionController";
import { RolesSection } from "@/components/roles/RolesSection";
import { BrandTransition } from "@/components/shared/BrandTransition";
import { FinalCTA } from "@/components/shared/FinalCTA";
import { Footer } from "@/components/shared/Footer";
import { ResearchToolsStrip } from "@/components/tools/ResearchToolsStrip";
import { AnalyticsPage } from "@/components/analytics/AnalyticsPage";
import { catalogModeOf } from "@/lib/analytics";
import { getPublishedAdvisors } from "@/lib/catalog";

export default async function Home() {
  // Published advisors from the Rebate catalog API (empty list -> honest empty state).
  const advisors = await getPublishedAdvisors();
  return (
    <main>
      <AnalyticsPage route="home" catalogMode={catalogModeOf(advisors)} />
      <LandingMotionController />
      <Hero />
      <ResearchToolsStrip />
      <InsightsSection />
      <ChallengesSection />
      <RolesSection advisors={advisors} />
      <LearningSection />
      <FinalCTA />
      <Footer />
      <BrandTransition />
    </main>
  );
}
