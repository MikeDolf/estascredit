import type { ArticleImage } from "@/content/uralforklift-articles";

/** Картинка статьи. width/height обязательны — иначе CLS. */
export default function UfFigure({
  image,
  priority = false,
  className = "",
}: {
  image: ArticleImage;
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
        className="w-full rounded-2xl border border-ink/10 bg-white object-cover shadow-card"
      />
    </figure>
  );
}
