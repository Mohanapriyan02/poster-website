import React from "react";
import { Camera } from "lucide-react";

interface GalleryTile {
  image: string;
  tag: string;
  caption: string;
}

const GALLERY_TILES: GalleryTile[] = [
  {
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    tag: "@living.minimal",
    caption: "Terracotta arch print anchored above oak sideboard.",
  },
  {
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    tag: "@cyber.space",
    caption: "Neo Tokyo skyline in ambient neon desk setup.",
  },
  {
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
    tag: "@atelier_corner",
    caption: "Nordic ceramic still life paired with linen drapes.",
  },
  {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    tag: "@garage_heritage",
    caption: "F40 technical monograph above classic reading lounge.",
  },
  {
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    tag: "@alpine_home",
    caption: "Dolomites dawn mist in museum white frame.",
  },
  {
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    tag: "@cinema_collector",
    caption: "Swiss typography cinema homage on studio wall.",
  },
];

export const AestheticGallery: React.FC = () => {
  return (
    <section className="py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#8C7D70] font-medium mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Styled in Living Spaces</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-normal">
            As Seen in Thoughtful Homes
          </h2>
          <p className="text-sm text-[#7A7167] mt-2 font-light">
            Inspiration from collectors who have brought our archival prints into bedrooms, lofts, and workspaces.
          </p>
        </div>

        {/* 6 Grid Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {GALLERY_TILES.map((tile, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden bg-[#F2EDE4] border border-[#EAE5DC]"
            >
              <img
                src={tile.image}
                alt={tile.caption}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white text-xs">
                <span className="text-[10px] font-mono text-[#C5A880]">{tile.tag}</span>
                <p className="text-[11px] text-[#FAF8F5] line-clamp-2 mt-0.5 leading-tight">
                  {tile.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
