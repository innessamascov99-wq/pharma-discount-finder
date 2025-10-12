import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { TrustBadges } from '../components/TrustBadges';
import { SearchBar } from '../components/SearchBar';
import { HowItWorks } from '../components/HowItWorks';
import { FeaturesGrid } from '../components/FeaturesGrid';
import { ProgramPreview } from '../components/ProgramPreview';
import { TrustTransparency } from '../components/TrustTransparency';
import { ChatBot } from '../components/ChatBot';

export const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <SearchBar />
      <HowItWorks />
      <FeaturesGrid />
      <ProgramPreview />
      <TrustTransparency />
      <ChatBot name="Jack" />
    </>
  );
};
