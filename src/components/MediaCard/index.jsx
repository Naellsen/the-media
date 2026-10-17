import Image from "next/image";
import Link from "next/link";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'><rect width='100%' height='100%' fill='%231f2937'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='24'>No Cover</text></svg>";

const MediaCard = ({ item, index }) => {
  const { title, image, subtitle, badge, score, description } = item || {};

  const validSrc = image && image.trim() !== "" ? image : PLACEHOLDER_IMAGE;
  const displayScore = badge || (score ? `★ ${score}` : null);
  const href = item.detailUrl || item.url || "#";

  return (
    <Link href={href} className="block h-full">
      <div className="flex flex-col justify-between h-full rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shadow-md">
        
        {/* Poster Container acts as its OWN independent 'group' */}
        <div className="group/poster relative h-80 w-full overflow-hidden bg-slate-950">
          <Image
            src={validSrc}
            alt={title || "Media Poster"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover/poster:scale-110"
            unoptimized={validSrc.startsWith("data:")}
          />

          {typeof index === "number" && (
            <span className="absolute top-2 left-2 z-20 bg-secondary-100 backdrop-blur-md text-white text-xs font-extrabold px-2 py-1 rounded shadow-md">
              #{index + 1}
            </span>
          )}

          {displayScore && (
            <span className="absolute top-2 right-2 z-20 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2 py-1 rounded shadow">
              {displayScore}
            </span>
          )}

          {/* Description Overlay - only triggers when hovering THIS specific poster */}
          {description && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xs opacity-0 group-hover/poster:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-center z-10 pointer-events-none">
              <p className="text-xs text-slate-300 line-clamp-6 leading-relaxed text-center">
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Card Title Footer */}
        <div className="p-3 flex flex-col grow justify-between bg-slate-900">
          <div>
            <h3 className="font-semibold text-sm line-clamp-1 text-slate-100">
              {title || "Untitled"}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;