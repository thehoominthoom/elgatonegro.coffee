import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PolaroidCardProps {
  src: string;
  alt: string;
  caption?: string;
  rotation?: "left" | "right" | "none";
  aspectRatio?: "square" | "portrait" | "landscape";
  href?: string;
  shadow?: "sm" | "lg";
  className?: string;
}

const aspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

const rotationClasses = {
  left: "rotate-[-1deg] hover:rotate-0 transition-transform duration-200",
  right: "rotate-[1deg] hover:rotate-0 transition-transform duration-200",
  none: "transition-transform duration-200",
};

const shadowClasses = {
  sm: "shadow-polaroid",
  lg: "shadow-polaroid-lg",
};

export function PolaroidCard({
  src,
  alt,
  caption,
  rotation = "left",
  aspectRatio = "square",
  href,
  shadow = "sm",
  className,
}: PolaroidCardProps) {
  const card = (
    <div
      className={cn(
        "inline-block",
        rotationClasses[rotation],
        shadowClasses[shadow],
        className,
      )}
    >
      <div className="bg-white p-3 pb-10 rounded-[2px]">
        <div
          className={cn("relative overflow-hidden", aspectClasses[aspectRatio])}
        >
          <Image
            fill
            src={src}
            alt={alt}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        {caption && (
          <p className="mt-2 text-sm font-display uppercase tracking-widest text-brand-black text-center">
            {caption}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return card;
}
