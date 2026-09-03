import { renderMarkdown } from "@/lib/markdown";
import SectionImage, { type PexelsImage } from "./SectionImage";

export default function BlogBody({
  markdown,
  sectionImages,
}: {
  markdown: string;
  sectionImages?: Record<string, PexelsImage>;
}) {
  return (
    <div className="prose-plumb">
      {renderMarkdown(markdown, {
        beforeH2: (_text, slug) => {
          const img = sectionImages?.[slug];
          if (!img) return null;
          return <SectionImage image={img} />;
        },
      })}
    </div>
  );
}
