import Image from "next/image";

/**
 * ImageTriptych — full-bleed 3-image band between §7 (FAQ) and §8 (RecentActivations)
 * on brand-activations and community-conventions services subpages.
 *
 * Desktop: 3-col grid, no gap, edge-to-edge. Each cell 3:2 landscape with
 * photo-treatment + grain-overlay-dark. Subtle hover (scale + brightness),
 * motion-safe gated.
 *
 * Mobile: horizontal snap-scroll — first image at 88vw, next peeks ~12vw.
 * `snap-x snap-mandatory` on container, `snap-start` on each cell.
 *
 * Section has no background — vertical padding shows page bg (brand-grey).
 *
 * Spec: copy/services-image-row-and-sigmoment-revisit-spec.md §1
 */

export interface TriptychImage {
  src: string;
  alt: string;
}

export interface ImageTriptychProps {
  images: [TriptychImage, TriptychImage, TriptychImage];
}

export function ImageTriptych({ images }: ImageTriptychProps) {
  return (
    <section
      aria-label="El Gato Negro service imagery"
      className="py-10 md:py-14"
    >
      {/* Desktop: full-bleed 3-col grid, no gap */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-0">
        {images.map((img) => (
          <div
            key={img.src}
            className="group relative aspect-[3/2] overflow-hidden grain-overlay-dark"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="33vw"
              className="object-cover photo-treatment motion-safe:transition motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-[1.02] motion-safe:group-hover:brightness-[1.03]"
            />
          </div>
        ))}
      </div>

      {/* Mobile: horizontal snap-scroll — first fills 88vw, next peeks ~12vw */}
      <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        <div className="flex w-max">
          {images.map((img) => (
            <div
              key={img.src}
              className="w-[88vw] shrink-0 snap-start snap-always"
            >
              <div className="relative aspect-[3/2] overflow-hidden grain-overlay-dark">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="88vw"
                  className="object-cover photo-treatment"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
