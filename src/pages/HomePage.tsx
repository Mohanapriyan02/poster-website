import React from "react";
import { Hero } from "../components/home/Hero";
import { FeaturedCategories } from "../components/home/FeaturedCategories";
import { CuratedGrid } from "../components/home/CuratedGrid";
import { LifestyleShowcase } from "../components/home/LifestyleShowcase";
import { CuratedCollections } from "../components/home/CuratedCollections";
import { BestsellerSection } from "../components/home/BestsellerSection";
import { BrandStory } from "../components/home/BrandStory";
import { AestheticGallery } from "../components/home/AestheticGallery";

export const HomePage: React.FC = () => {
  return (
    <div className="flex-1">
      <Hero />
      <FeaturedCategories />
      <CuratedGrid />
      <LifestyleShowcase />
      <CuratedCollections />
      <BestsellerSection />
      <BrandStory />
      <AestheticGallery />
    </div>
  );
};
