 import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchComicVine } from "@/utils/api";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750'><rect width='100%' height='100%' fill='%231f2937'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='24'>No Cover</text></svg>";

async function getVolume(id) {
  const data = await fetchComicVine(`volume/4050-${id}`, {
    field_list:
      "id,name,deck,description,image,publisher,start_year,count_of_issues,characters,people",
  });
  return data && !Array.isArray(data) ? data : null;
}

async function getTopWithImages(resource, items, limit = 20) {
  if (!Array.isArray(items) || items.length === 0) return [];

  const top = [...items]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, limit);

  const data = await fetchComicVine(resource, {
    filter: `id:${top.map((i) => i.id).join("|")}`,
    field_list: "id,image",
    limit,
  });

  const images = new Map(
    (Array.isArray(data) ? data : []).map((i) => [i.id, i.image])
  );

  return top.map((i) => ({
    id: i.id,
    name: i.name,
    count: i.count,
    image:
      images.get(i.id)?.medium_url ||
      images.get(i.id)?.small_url ||
      PLACEHOLDER_IMAGE,
  }));
}

async function getVolumeIssues(volumeId) {
  const data = await fetchComicVine("issues", {
    filter: `volume:${volumeId}`,
    limit: 100,
    field_list: "id,name,issue_number,image,store_date,cover_date",
  });
  return Array.isArray(data) ? data : [];
}


function formatMonthYear(date) {
  if (!date) return null;
  const d = new Date(`${date}T00:00:00Z`);
  if (isNaN(d)) return null;
  return d.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const volume = await getVolume(id);
  return { title: volume?.name || "Comic" };
}

const Page = async ({ params, searchParams }) => {
  const { id } = await params;
  const { sort } = await searchParams; 

  const [volume, rawIssues] = await Promise.all([
    getVolume(id),
    getVolumeIssues(id),
  ]);

  if (!volume) notFound();

  const [characters, staff] = await Promise.all([
        getTopWithImages("characters", volume.characters),
        getTopWithImages("people", volume.people),
    ]);

  const ascending = sort === "asc";
  const issues = [...rawIssues].sort((a, b) => {
    const diff = parseFloat(a.issue_number) - parseFloat(b.issue_number);
    return ascending ? diff : -diff;
  });

  const cover =
    volume.image?.super_url ||
    volume.image?.original_url ||
    volume.image?.medium_url ||
    PLACEHOLDER_IMAGE;

  const meta = [
    volume.publisher?.name,
    volume.start_year,
    volume.count_of_issues != null && `${volume.count_of_issues} issues`,
  ]
    .filter(Boolean)
    .join(" • ");

  const total = volume.count_of_issues ?? issues.length;

  return (
    <div className="container mx-auto p-4 space-y-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-72 aspect-2/3 shrink-0 rounded-lg overflow-hidden bg-slate-950">
          <Image
            src={cover}
            alt={volume.name}
            fill
            sizes="(max-width: 768px) 100vw, 288px"
            className="object-cover"
            priority
            unoptimized={cover.startsWith("data:")}
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-accent">{volume.name}</h1>
          {meta && <p className="text-slate-400 text-sm">{meta}</p>}
          {volume.deck && <p className="text-slate-300">{volume.deck}</p>}
          {volume.description && (
            <div
              className="text-slate-300 text-sm space-y-2"
              dangerouslySetInnerHTML={{ __html: volume.description }}
            />
          )}
        </div>
      </div>

      <section>
        <div className="flex items-end justify-between border-b border-slate-700 pb-3 mb-6">
          <h2 className="text-2xl font-bold text-accent">
            {total} {total === 1 ? "issue" : "issues"} in this volume
          </h2>

          <Link
            href={`/comic/${id}?sort=${ascending ? "desc" : "asc"}`}
            className="text-sm font-semibold px-3 py-1.5 rounded bg-slate-800 text-slate-100 hover:bg-slate-700"
          >
            Reverse sort
          </Link>
        </div>

        {issues.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {issues.map((issue) => {
              const img =
                issue.image?.super_url ||
                issue.image?.medium_url ||
                PLACEHOLDER_IMAGE;
              const date = formatMonthYear(issue.store_date || issue.cover_date);

              return (
                <Link
                  key={issue.id}
                  href={`/comic/issue/${issue.id}`}
                  className="group text-center"
                >
                  <div className="relative aspect-2/3 w-full overflow-hidden rounded bg-slate-950">
                    <Image
                      src={img}
                      alt={issue.name || `Issue #${issue.issue_number}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized={img.startsWith("data:")}
                    />
                  </div>

                  <p className="mt-3 font-bold text-slate-100">
                    Issue #{issue.issue_number}
                  </p>
                  {issue.name && (
                    <p className="text-sm text-slate-300 line-clamp-2">
                      {issue.name}
                    </p>
                  )}
                  {date && <p className="text-sm text-slate-500">{date}</p>}
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500">No issues found.</p>
        )}
      </section>
      {characters.length > 0 && (
        <section>
            <h2 className="text-2xl font-bold text-accent border-b border-slate-700 pb-3 mb-6">
            Characters
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {characters.map((c) => (
                <Link
                key={c.id}
                href={`/comic/character/${c.id}`}
                className="group text-center"
                >
                <div className="relative aspect-square w-full overflow-hidden rounded bg-slate-950">
                    <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 16vw"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    unoptimized={c.image.startsWith("data:")}
                    />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-100 line-clamp-1 group-hover:underline">
                    {c.name}
                </p>
                <p className="text-xs text-slate-500">
                    {c.count} {c.count === 1 ? "issue" : "issues"}
                </p>
                </Link>
            ))}
            </div>
        </section>
    )}
    {staff.length > 0 && (
        <section>
            <h2 className="text-2xl font-bold text-accent border-b border-slate-700 pb-3 mb-6">
            Staff
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {staff.map((p) => (
                <Link
                key={p.id}
                href={`/comic/person/${p.id}`}
                className="group text-center"
                >
                <div className="relative aspect-square w-full overflow-hidden rounded bg-slate-950">
                    <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 16vw"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    unoptimized={p.image.startsWith("data:")}
                    />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-100 line-clamp-1 group-hover:underline">
                    {p.name}
                </p>
                <p className="text-xs text-slate-500">
                    {p.count} {p.count === 1 ? "issue" : "issues"}
                </p>
                </Link>
            ))}
            </div>
        </section>
    )}
    </div>
  )
}

export default Page;