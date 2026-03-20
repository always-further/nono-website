import Image from "next/image";

interface BlogImageProps {
  src?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function BlogImage({
  src,
  alt = "",
  caption,
  width = 1200,
  height = 630,
}: BlogImageProps) {
  if (!src) return null;

  return (
    <figure className="my-8">
      <div className="relative overflow-hidden border border-border">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-xs font-mono text-muted mt-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
