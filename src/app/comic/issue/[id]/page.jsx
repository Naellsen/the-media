import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchComicVine } from "@/utils/api";
import WikiContent from "@/components/WikiContents";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750'><rect width='100%' height='100%' fill='%231f2937'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='24'>No Cover</text></svg>";

async function getIssue(id) {
  const data = await fetchComicVine(`issue/4000-${id}`, {
    field_list: [
      "id", "name", "issue_number", "deck", "description", "image",
      "volume", "store_date", "cover_date",
      "person_credits", "character_credits",
    ].join(","),
  });
  return data && !Array.isArray(data) ? data : null;
}

// Fetch images for a list of characters/people in ONE request.
// resource: "characters" | "people"
async function getWithImages(resource, items, limit = 24) {
  if (!Array.isArray(items) || items.length === 0) return [];

  const top = items.slice(0, limit);

  const data = await fetchComicVine(resource, {
    filter: `id:${top.map((i) => i.id).join("|")}`,
    field_list: "id,image",
    limit,
  });

  const images = new Map(
    (Array.isArray(data) ? data : []).map((i) => [i.id, i.image])
  );

  return top.map((i) => ({
    ...i,
    image:
      images.get(i.id)?.medium_url ||
      images.get(i.id)?.small_url ||
      PLACEHOLDER_IMAGE,
  }));
}

// One entry per person, with all their roles combined
function groupCreators(credits = []) {
  const map = new Map();
  for (const p of credits) {
    if (!map.has(p.id)) map.set(p.id, { id: p.id, name: p.name, roles: [] });
    (p.role || "")
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean)
      .forEach((r) => {
        const entry = map.get(p.id);
        if (!entry.roles.includes(r)) entry.roles.push(r);
      });
  }
  return [...map.values()];
}

function buildTitle(issue) {
  return (
    [
      issue.volume?.name,
      issue.name || (issue.issue_number ? `#${issue.issue_number}` : null),
    ]
      .filter(Boolean)
      .join(" - ") || "Untitled"
  );
}

function formatDate(date) {
  if (!date) return null;
  const d = new Date(`${date}T00:00:00Z`);
  if (isNaN(d)) return null;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const issue = await getIssue(id);
  return { title: issue ? buildTitle(issue) : "Issue" };
}

const Page = async ({ params }) => {
  const { id } = await params;
  const issue = await getIssue(id);

  if (!issue) notFound();

  const creatorList = groupCreators(issue.person_credits);

  const [characters, creators] = await Promise.all([
    getWithImages("characters", issue.character_credits),
    getWithImages("people", creatorList),
  ]);

  const title = buildTitle(issue);

  const cover =
    issue.image?.super_url ||
    issue.image?.original_url ||
    issue.image?.medium_url ||
    PLACEHOLDER_IMAGE;

  const meta = [
    issue.issue_number && `Issue #${issue.issue_number}`,
    formatDate(issue.store_date || issue.cover_date),
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="container mx-auto p-4 space-y-10">
      {/* Header (same layout as the comic page) */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-72 aspect-2/3 shrink-0 rounded-lg overflow-hidden bg-primary">
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 288px"
            className="object-cover"
            priority
            unoptimized={cover.startsWith("data:")}
          />
        </div>

        <div className="space-y-3 min-w-0 flex-1">
          {issue.volume?.id && (
            <Link
              href={`/comic/${issue.volume.id}`}
              className="text-sm text-secondary-50 hover:underline"
            >
              ← {issue.volume.name}
            </Link>
          )}

          <h1 className="text-3xl font-bold text-accent">{title}</h1>

          {meta && <p className="text-accent/60 text-sm">{meta}</p>}

          {issue.deck && <p className="text-accent/80">{issue.deck}</p>}

          {issue.description ? (
            <WikiContent html={issue.description} />
          ) : (
            !issue.deck && (
              <p className="text-accent/50 text-sm">No description available.</p>
            )
          )}
        </div>
      </div>

      {/* Characters */}
      {characters.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-accent border-b border-secondary-100 pb-3 mb-6">
            Characters
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {characters.map((c) => (
              <Link
                key={c.id}
                href={`/comic/character/${c.id}`}
                className="group text-center"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded bg-primary">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 16vw"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    unoptimized={c.image.startsWith("data:")}
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-accent line-clamp-1 group-hover:underline">
                  {c.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Staff */}
      {creators.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-accent border-b border-secondary-100 pb-3 mb-6">
            Staff
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {creators.map((p) => (
              <Link
                key={p.id}
                href={`/comic/person/${p.id}`}
                className="group text-center"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded bg-primary">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 16vw"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    unoptimized={p.image.startsWith("data:")}
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-accent line-clamp-1 group-hover:underline">
                  {p.name}
                </p>
                {p.roles.length > 0 && (
                  <p className="text-xs text-accent/50 capitalize line-clamp-1">
                    {p.roles.join(", ")}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Page;