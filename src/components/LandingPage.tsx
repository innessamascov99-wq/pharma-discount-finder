import React from 'react';
import { Hero } from './Hero';
import { Highlights } from './Highlights';
import { SearchBar } from './SearchBar';
import { SamplePrograms } from './SamplePrograms';
import { HowItWorks } from './HowItWorks';
import { Features } from './Features';
import { Trust } from './Trust';
import { Expansion } from './Expansion';
import { FAQ } from './FAQ';

export function LandingPage() {
  return (
    <>
      <Hero />
      <Highlights />
      <SearchBar />
      <SamplePrograms />
      <HowItWorks />
      <Features />
      <Trust />
      <Expansion />
      <FAQ />
    </>
  );
}