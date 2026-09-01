import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { InteractiveCalculator } from '@/components/landing/InteractiveCalculator';
import { Testimonials } from '@/components/landing/Testimonials';

export default function LandingPage() {
  return (
    <div className="w-full">
      <Hero />
      <FeatureGrid />
      <InteractiveCalculator />
      <Testimonials />
    </div>
  );
}
