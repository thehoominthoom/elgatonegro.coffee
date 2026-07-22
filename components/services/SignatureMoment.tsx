import Image from "next/image";

/**
 * SignatureMoment — editorial photo-essay block.
 *
 * Asymmetric 7/5 grid (image-dominant), landscape aspect (4/3), enriched
 * marginalia — dashed rule above eyebrow, photo caption below image,
 * signature block with name + role replacing single-line attribution.
 *
 * When `image.src` is null the block renders the branded placeholder pattern
 * (dark bg + hellcat watermark at 4% opacity).
 *
 * New optional props (backward-compatible):
 *   attributionRole  — role line under signature name (e.g. "Co-founder, EGN")
 *   photoCaption     — editorial caption below image (uppercased via CSS)
 *
 * Spec: copy/services-image-row-and-sigmoment-revisit-spec.md §2
 */

interface SignatureMomentProps {
  eyebrow: string;
  body: string[];
  attribution?: string;
  attributionRole?: string;
  photoCaption?: string;
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
  attributionRole,
  photoCaption,
  image,
  imageOnLeft = false,
  surface,
}: SignatureMomentProps) {
  const isDark = surface === "dark";
  const eyebrowColor = isDark ? "text-brand-orange" : "text-brand-green";
  const bodyColor = isDark ? "text-brand-grey/75" : "text-brand-black/75";
  const ruleColor = isDark ? "border-brand-grey/15" : "border-brand-black/15";
  const captionColor = isDark ? "text-brand-grey/50" : "text-brand-black/50";
  const roleColor = isDark ? "text-brand-grey/60" : "text-brand-black/60";

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
      {/* Editorial section rule */}
      <div className={`border-t border-dashed ${ruleColor} mb-8 md:mb-10`} />

      <p
        className={`font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] mb-8 md:mb-10 ${eyebrowColor}`}
      >
        {eyebrow}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
        {/* Image column — col-span-7 */}
        <div
          className={`${
            imageOnLeft
              ? "md:col-span-7 md:order-1"
              : "md:col-span-7 md:order-2"
          } order-1`}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm grain-overlay-sm bg-brand-black">
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
          {photoCaption ? (
            <p
              className={`font-sans font-extrabold text-xs uppercase tracking-[0.15em] ${captionColor} mt-4`}
            >
              {photoCaption}
            </p>
          ) : null}
        </div>

        {/* Text column — col-span-5 */}
        <div
          className={`${
            imageOnLeft
              ? "md:col-span-5 md:order-2"
              : "md:col-span-5 md:order-1"
          } order-2`}
        >
          <div className="border-l-2 border-brand-orange pl-5 md:pl-6 space-y-5">
            {body.map((paragraph) => (
              <p
                key={paragraph}
                className={`font-sans text-base md:text-lg leading-relaxed ${bodyColor}`}
              >
                {paragraph}
              </p>
            ))}

            {attribution ? (
              <div className={`border-t ${ruleColor} mt-6 pt-6`}>
                <p className="font-accent text-2xl md:text-3xl text-brand-orange leading-none">
                  {attribution}
                </p>
                {attributionRole ? (
                  <p
                    className={`font-sans text-xs md:text-sm uppercase tracking-[0.15em] ${roleColor} mt-2`}
                  >
                    {attributionRole}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
