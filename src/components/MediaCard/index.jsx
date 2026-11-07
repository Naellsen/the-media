import Image from "next/image";
import Link from "next/link";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'><rect width='100%' height='100%' fill='%231f2937'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='24'>No Cover</text></svg>";

const MediaCard = ({ item, index }) => {
  const { title, image, subtitle, badge, score, description } = item || {};

  const validSrc = image && image.trim() !== "" ? image : PLACEHOLDER_IMAGE;
  const displayScore = badge || (score ? `★ ${score}` : null);
  const href = item?.detailUrl || item?.url || "#";
  
  return (
    <Link href={href}>
      <div className="flex flex-col border-4 hover:border-gray-500 rounded-xl overflow-hidden bg-slate-950">
        <div className="group relative h-60 w-full">
          <div className="relative w-full h-full">
            <Image
              src={validSrc}
              alt={title || "Media Poster"}
              fill
              className="object-cover object-center transition-transform duration-500"
              unoptimized={validSrc.startsWith("data:")}
              loading="eager"
            />
          </div>

          {typeof index === "number" && (
            <span className="absolute top-2 left-2 z-20 bg-secondary-100 backdrop-blur-md text-white text-xs font-extrabold px-2 py-1 rounded shadow-md">
              #{index + 1}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;