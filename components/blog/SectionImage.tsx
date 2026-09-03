export type PexelsImage = {
  file: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
  pexelsUrl: string;
  width: number;
  height: number;
};

export default function SectionImage({
  image,
  priority = false,
  className = "",
}: {
  image: PexelsImage;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={`my-8 ${className}`}>
      <img
        src={image.file}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        sizes="(min-width: 768px) 720px, 100vw"
        className="aspect-[16/9] w-full rounded-2xl object-cover shadow-card"
      />
      <figcaption className="mt-2 text-center text-[11px] text-ink/70">
        Photo by{" "}
        <a
          href={image.photographerUrl}
          target="_blank"
          rel="noopener nofollow"
          className="text-ink/80 underline-offset-4 hover:text-ink hover:underline"
        >
          {image.photographer}
        </a>{" "}
        on{" "}
        <a
          href={image.pexelsUrl || "https://www.pexels.com"}
          target="_blank"
          rel="noopener nofollow"
          className="text-ink/80 underline-offset-4 hover:text-ink hover:underline"
        >
          Pexels
        </a>
      </figcaption>
    </figure>
  );
}
