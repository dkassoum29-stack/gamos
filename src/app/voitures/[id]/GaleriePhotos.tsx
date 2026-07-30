"use client";

import { useState } from "react";

export default function GaleriePhotos({
  photos,
  alt,
}: {
  photos: string[];
  alt: string;
}) {
  const [actif, setActif] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="aspect-[4/3] w-full rounded-2xl bg-zinc-100 flex items-center justify-center">
        <span className="text-7xl" aria-hidden>
          🚗
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-[4/3] w-full rounded-2xl bg-zinc-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[actif]}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2">
          {photos.map((photo, i) => (
            <button
              key={photo}
              type="button"
              onClick={() => setActif(i)}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === actif ? "border-[#3B82F6]" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
