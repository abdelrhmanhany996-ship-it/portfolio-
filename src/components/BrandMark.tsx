import React from 'react';

/** Renders a brand like "labib.studio" with the dot highlighted in the accent color. */
export const BrandMark: React.FC<{ brand: string; className?: string }> = ({ brand, className }) => {
  const dot = brand.indexOf('.');
  return (
    <span className={className}>
      {dot === -1 ? (
        brand
      ) : (
        <>
          {brand.slice(0, dot)}
          <span className="text-[#F59E0B]">.</span>
          {brand.slice(dot + 1)}
        </>
      )}
    </span>
  );
};
