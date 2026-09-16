import Image from "next/image"

const PLACEHOLDER_ANILIST_IMG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'><rect width='100%' height='100%' fill='%231f2937'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='24'>No Cover</text></svg>";

const MediaCard = ({item}) => {
    const {title, image, subtitle, badge, score} = item || [];

    const validSrc = image && image.trim() !== "" ? image :PLACEHOLDER_ANILIST_IMG;
    const displayScore = badge || (score ? `★ ${score}` : null);


    return (
        <div className="card border rounded p-2 flex flex-col justify-between h-full bg-slate-900 border-slate-800">
            <div className="image-container relative h-80 w-full overflow-hidden rounded">
                <Image 
                src={validSrc}
                alt={title || `Media Poster`}
                fill
                size="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition-transform duration-300 hover:scale-105 "
                />
                {displayScore && (
                <span className="badge absolute top-0 right-0 bg-black/80 text-amber-400 text-[10px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm">
                {displayScore}
                </span>
            )}
            </div>      
            <h3 className="font-bold mt-2 text-sm line-clamp-2 text-slate-100">
                {title || "Untitled"}
            </h3>
            {subtitle && (
                <p className="subtitle text-xs text-slate-400 mt-1">{subtitle}</p>
            )}
        </div>
    );
}

export default MediaCard