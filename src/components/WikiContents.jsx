import { cleanComicHtml } from "@/utils/sanitize";

export default function WikiContent({ html }) {
  if (!html) return null;
  return (
    <div
      className="comic-wiki"
      dangerouslySetInnerHTML={{ __html: cleanComicHtml(html) }}
    />
  );
}