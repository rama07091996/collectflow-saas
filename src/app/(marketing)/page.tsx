import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { AIVideoShowcase } from '@/components/landing/AIVideoShowcase';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { InteractiveCalculator } from '@/components/landing/InteractiveCalculator';
import { Pricing } from '@/components/landing/Pricing';
import { Testimonials } from '@/components/landing/Testimonials';

export default function LandingPage() {
  return (
    <div className="w-full">
      <Hero />
      <AIVideoShowcase />
      <FeatureGrid />
      <InteractiveCalculator />
      <Pricing />
      <Testimonials />
    </div>
  );
}
