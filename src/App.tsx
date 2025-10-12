import { useState, useEffect } from 'react';
import { InitialAnimation } from './components/InitialAnimation';
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
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    const visited = sessionStorage.getItem('hasVisited');
    if (visited) {
      setShowAnimation(false);
      setShowContent(true);
      setHasVisited(true);
    }
  }, []);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setTimeout(() => {
      setShowContent(true);
      setHasVisited(true);
      sessionStorage.setItem('hasVisited', 'true');
    }, 100);
  };

  return (
    <>
      {showAnimation && !hasVisited && (
        <InitialAnimation onComplete={handleAnimationComplete} />
      )}

      {showContent && (
        <div className="min-h-screen bg-background animate-in fade-in duration-700">
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
      )}
    </>
  );
}

export default App;