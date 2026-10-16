import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";

interface RoomScene {
  id: string;
  name: string;
  headline: string;
  description: string;
  image: string;
  posterName: string;
  posterSlug: string;
  specs: string;
}

const ROOM_SCENES: RoomScene[] = [
  {
    id: "living-room",
    name: "Minimalist Living",
    headline: "Warmth, Space & Quiet Grandeur",
    description: "Pairing organic terracotta and Bauhaus geometry with neutral Scandinavian linen upholstery and natural morning light.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
    posterName: "Mid-Century Arch: Terracotta Balance",
    posterSlug: "terracotta-arch-abstract-forms",
    specs: "Displayed as A1 (23.4 × 33.1 in) in Natural Oak Frame",
  },
  {
    id: "bedroom",
    name: "Sanctuary Bedroom",
    headline: "Unwind into Serene Horizons",
    description: "Soft atmospheric photography and mist-shrouded peaks create a low-contrast, tranquil visual presence ideal for restful evenings.",
    image: "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=85",
    posterName: "Alpe di Siusi: Dolomites Dawn Mist",
    posterSlug: "dolomites-alpine-peak-in-mist",
    specs: "Displayed as A2 (16.5 × 23.4 in) in Matte White Gallery Frame",
  },
  {
    id: "studio",
    name: "Creative Studio",
    headline: "Everyday Creative Resonance",
    description: "Surround your desk with precision typography and cult cinematic framing that inspires daily focus, contemplation, and craft.",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=85",
    posterName: "Zürich 1957: International Typographic Order",
    posterSlug: "swiss-international-typography-poster",
    specs: "Displayed as A3 (11.7 × 16.5 in) in Solid Black Wood Frame",
  },
  {
    id: "gaming-room",
    name: "Ambient Gaming Den",
    headline: "World-Building Beyond the Screen",
    description: "Deep noir contrasts, cyan neon glows, and golden fantasy trees bringing digital lore into tactile museum-quality reality.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85",
    posterName: "The Golden Erdtree: Sanctuary of Grace",
    posterSlug: "elden-erdtree-golden-sanctuary",
    specs: "Displayed as A2 (16.5 × 23.4 in) in Slim Matte Black Frame",
  },
];

export const LifestyleShowcase: React.FC = () => {
  const [activeRoom, setActiveRoom] = useState<RoomScene>(ROOM_SCENES[0]);

  return (
    <section className="py-20 bg-[#1C1A17] text-[#FAF8F5] border-b border-[#2E2A25]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-8 border-b border-[#2E2A25]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#C5A880] mb-2 font-medium">
              <Compass className="w-3.5 h-3.5" />
              <span>Lifestyle Showcase</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF8F5] font-normal">
              Your Space. Your Story.
            </h2>
          </div>
          <p className="text-sm text-[#A89E92] max-w-md mt-3 md:mt-0 font-light leading-relaxed">
            Find the pieces that make a room feel unmistakably yours. Explore how art transforms modern interiors.
          </p>
        </div>

        {/* Room Switcher Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-8 border-b border-[#2E2A25] whitespace-nowrap">
          {ROOM_SCENES.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room)}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-all cursor-pointer ${
                activeRoom.id === room.id
                  ? "bg-[#C5A880] text-[#1C1A17] font-semibold"
                  : "text-[#A89E92] hover:text-[#FAF8F5] border border-[#332E27] hover:border-[#4D453B]"
              }`}
            >
              {room.name}
            </button>
          ))}
        </div>

        {/* Cinematic Room Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Large Room Mockup Photo */}
          <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#24211D] border border-[#332E27]">
            <img
              src={activeRoom.image}
              alt={activeRoom.name}
              className="w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Spec Tag overlay */}
            <div className="absolute bottom-4 left-4 bg-[#1C1A17]/85 backdrop-blur-xs text-[11px] text-[#FAF8F5] px-3 py-1.5 border border-[#332E27]">
              {activeRoom.specs}
            </div>
          </div>

          {/* Description & Artwork Link */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-widest text-[#C5A880]">
              Interior Perspective
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#FAF8F5] mt-2">
              {activeRoom.headline}
            </h3>
            <p className="text-sm text-[#A89E92] mt-4 leading-relaxed font-light">
              {activeRoom.description}
            </p>

            <div className="mt-8 pt-6 border-t border-[#2E2A25]">
              <span className="text-[11px] uppercase tracking-wider text-[#A89E92]">Featured Artwork:</span>
              <p className="font-serif text-lg text-[#FAF8F5] mt-1">{activeRoom.posterName}</p>
              
              <Link
                to={`/poster/${activeRoom.posterSlug}`}
                className="mt-4 inline-flex items-center gap-2 bg-[#FAF8F5] hover:bg-[#EAE5DC] text-[#1C1A17] px-5 py-2.5 text-xs uppercase tracking-widest font-medium transition-colors"
              >
                <span>View This Art Print</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
