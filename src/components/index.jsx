import Image from "next/image";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'><rect width='100%' height='100%' fill='%231f2937'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='24'>No Cover</text></svg>";

const MediaCard = ({ item }) => {
  const { title, image, subtitle, badge, score, description } = item || {};

  const validSrc = image && image.trim() !== "" ? image : PLACEHOLDER_IMAGE;
  const displayScore = badge || (score ? `★ ${score}` : null);

  return (
    <div className="group relative flex flex-col justify-between h-full rounded-lg bg-slate-900 border border-slate-800 overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      {/* Poster Image Container */}
      <div className="relative h-80 w-full overflow-hidden bg-slate-950">
        <Image
          src={validSrc}
          alt={title || "Media Poster"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized={validSrc.startsWith("data:")}
        />

        {/* Score Badge */}
        {displayScore && (
          <span className="absolute top-2 right-2 z-10 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2 py-1 rounded shadow">
            {displayScore}
          </span>
        )}

        {/* Hover Gradient Overlay with Description */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end z-10">
          {description && (
            <p className="text-xs text-slate-300 line-clamp-6 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Content Footer */}
      <div className="p-3 flex flex-col flex-grow justify-between bg-slate-900 z-10">
        <div>
          <h3 className="font-semibold text-sm line-clamp-1 text-slate-100 group-hover:text-blue-400 transition-colors">
            {title || "Untitled"}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5 font-medium">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaCard;