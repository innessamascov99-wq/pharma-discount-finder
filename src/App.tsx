import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TrustBadges } from './components/TrustBadges';
import { SearchBar } from './components/SearchBar';
import { ProgramPreview } from './components/ProgramPreview';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesGrid } from './components/FeaturesGrid';
import { TrustTransparency } from './components/TrustTransparency';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection />
        <TrustBadges />
        <SearchBar />
        <ProgramPreview />
        <HowItWorks />
        <FeaturesGrid />
        <TrustTransparency />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;