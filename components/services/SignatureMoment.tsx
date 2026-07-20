import Image from "next/image";

/**
 * SignatureMoment — editorial photo-essay block.
 * One dominant image, a short body, optional attribution in Permanent Marker.
 *
 * When `image.src` is null the block renders the branded placeholder pattern
 * used across the site (dark bg + hellcat watermark at 4% opacity), matching
 * the convention on the current /services template.
 *
 * Spec: copy/services-pages-design-spec.md §3.2
 */

interface SignatureMomentProps {
  eyebrow: string;
  body: string[];
  attribution?: string;
  image: {
    src: string | null;
    alt: string;
  };
  imageOnLeft?: boolean;
  surface: "light" | "dark";
}

export function SignatureMoment({
  eyebrow,
  body,
  attribution,
  image,
  imageOnLeft = false,
  surface,
}: SignatureMomentProps) {
  const isDark = surface === "dark";
  const eyebrowColor = isDark ? "text-brand-orange" : "text-brand-green";
  const bodyColor = isDark ? "text-brand-grey/75" : "text-brand-black/75";

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
      <p
        className={`font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] mb-10 md:mb-12 ${eyebrowColor}`}
      >
        {eyebrow}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
        <div
          className={`${
            imageOnLeft ? "md:col-span-7 md:order-1" : "md:col-span-7 md:order-2"
          } order-1`}
        >
          <div className="relative aspect-[3/4] md:aspect-[3/5] overflow-hidden rounded-sm grain-overlay-sm bg-brand-black">
            {image.src ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover photo-treatment"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element -- decorative watermark placeholder while confirmed image not yet on disk */
              <img
                src="/brand/hellcat-color.svg"
                alt=""
                className="absolute inset-0 w-1/2 h-1/2 m-auto object-contain opacity-[0.04]"
              />
            )}
          </div>
        </div>

        <div
          className={`${
            imageOnLeft ? "md:col-span-5 md:order-2" : "md:col-span-5 md:order-1"
          } order-2`}
        >
          <div className="border-l-2 border-brand-orange pl-5 md:pl-6 max-w-md space-y-5">
            {body.map((paragraph) => (
              <p
                key={paragraph}
                className={`font-sans text-base md:text-lg leading-relaxed ${bodyColor}`}
              >
                {paragraph}
              </p>
            ))}
            {attribution ? (
              <p className="font-accent text-lg text-brand-orange mt-4">
                {attribution}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
