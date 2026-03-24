import Image from "next/image";

const photos = [
  { src: "/compare/_DSC6129.jpg", label: "5 Star — _DSC6129" },
  { src: "/compare/_DSC6150.jpg", label: "5 Star — _DSC6150" },
  { src: "/compare/_DSC6132.jpg", label: "4 Star — _DSC6132" },
  { src: "/compare/_DSC6196.jpg", label: "4 Star — _DSC6196" },
  { src: "/compare/_DSC6139.jpg", label: "3 Star — _DSC6139" },
];

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-neutral-900 px-4 py-12 md:px-8">
      <h1 className="mb-12 text-center text-3xl font-bold tracking-wide text-white uppercase">
        Photo Treatment Comparison
      </h1>

      <div className="mx-auto max-w-6xl space-y-16">
        {photos.map((photo) => (
          <div key={photo.src}>
            <p className="mb-4 text-sm font-medium tracking-widest text-neutral-400 uppercase">
              {photo.label}
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Original — no treatment */}
              <div>
                <p className="mb-2 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                  Original
                </p>
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={`${photo.label} — original`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* EGN treatment — grain-overlay + photo-treatment */}
              <div>
                <p className="mb-2 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                  EGN Treatment
                </p>
                <div className="relative aspect-[3/2] overflow-hidden grain-overlay">
                  <Image
                    src={photo.src}
                    alt={`${photo.label} — EGN treatment`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover photo-treatment"
                  />
                </div>
              </div>

              {/* EGN treatment — B&W */}
              <div>
                <p className="mb-2 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                  EGN Treatment — B&W
                </p>
                <div className="relative aspect-[3/2] overflow-hidden grain-overlay">
                  <Image
                    src={photo.src}
                    alt={`${photo.label} — EGN treatment B&W`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    style={{ filter: "contrast(1.45) sepia(0.5) saturate(0) blur(0.4px)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
