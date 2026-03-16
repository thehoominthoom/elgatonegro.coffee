import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PolaroidCardProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
  href?: string;
  className?: string;
}

const aspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

export function PolaroidCard({
  src,
  alt,
  caption,
  aspectRatio = "square",
  href,
  className,
}: PolaroidCardProps) {
  const card = (
    <div className={cn("inline-block", className)}>
      <div
        className={cn("relative overflow-hidden", aspectClasses[aspectRatio])}
      >
        <Image
          fill
          src={src}
          alt={alt}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {caption && (
        <p className="mt-2 text-xs font-display uppercase tracking-widest text-brand-black">
          {caption}
        </p>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return card;
}
