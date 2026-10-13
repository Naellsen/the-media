import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchComicVine } from "@/utils/api";
import WikiContent from "@/components/WikiContents";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750'><rect width='100%' height='100%' fill='%231f2937'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='24'>No Image</text></svg>";

const GENDERS = { 1: "Male", 2: "Female", 0: "Other" };

async function getPerson(id) {
  const data = await fetchComicVine(`person/4040-${id}`, {
    field_list: [
      "id", "name", "aliases", "deck", "description", "image", "images",
      "birth", "death", "hometown", "country", "gender", "website",
      "created_characters", "volume_credits",
    ].join(","),
  });
  return data && !Array.isArray(data) ? data : null;
}

// Covers for the person's volumes, fetched in ONE request
async function getWorks(credits, limit = 18) {
  if (!Array.isArray(credits) || credits.length === 0) return [];

  const top = [...credits].sort((a, b) => b.id - a.id).slice(0, limit);

  const data = await fetchComicVine("volumes", {
    filter: `id:${top.map((v) => v.id).join("|")}`,
    limit,
    field_list: "id,name,start_year,publisher,image",
  });

  return Array.isArray(data) ? data : [];
}

function formatDate(value) {
  if (!value) return null;
  const d = new Date(String(value).slice(0, 10) + "T00:00:00Z");
  if (isNaN(d)) return String(value).slice(0, 10);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const person = await getPerson(id);
  return { title: person?.name || "Creator" };
}

function Row({ label, children }) {
  if (!children) return null;
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 px-3 py-2 border-b border-secondary-100 text-xs">
      <dt className="font-semibold text-accent">{label}</dt>
      <dd className="text-accent/70 break-words">{children}</dd>
    </div>
  );
}

function SideSection({ title, children }) {
  return (
    <section className="rounded border border-secondary-100 bg-secondary-100/40">
      <h2 className="px-3 py-2 text-sm font-bold text-accent border-b border-secondary-100">
        {title}
      </h2>
      {children}
    </section>
  );
}

const Page = async ({ params }) => {
  const { id } = await params;
  const person = await getPerson(id);

  if (!person) notFound();

  const works = await getWorks(person.volume_credits);

  const image =
    person.image?.original_url ||
    person.image?.super_url ||
    person.image?.medium_url ||
    PLACEHOLDER_IMAGE;

  const aliases = (person.aliases || "")
    .split("\n")
    .map((a) => a.trim())
    .filter(Boolean);

  const gallery = (person.images || []).slice(0, 9);
  const createdCharacters = person.created_characters || [];

  return (
    <div className="container mx-auto py-8 px-40">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-6">
          <h1 className="text-3xl font-bold text-accent">{person.name}</h1>

          {person.deck && <p className="text-lg text-accent/80">{person.deck}</p>}

          {person.description ? (
            <WikiContent html={person.description} />
          ) : (
            !person.deck && (
              <p className="text-accent/50 text-sm">No biography available.</p>
            )
          )}
        </div>

        
        <aside className="w-full lg:w-80 shrink-0 space-y-4">
          <Image
            src={image}
            alt={person.name}
            width={320}
            height={480}
            sizes="(max-width: 1024px) 100vw, 320px"
            className="w-full h-auto rounded-lg"
            priority
            unoptimized={image.startsWith("data:")}
          />

          {gallery.length > 0 && (
            <SideSection title="Latest Images">
              <div className="grid grid-cols-3 gap-1 p-2">
                {gallery.map((img, i) => {
                  const src = img.small_url || img.medium_url || img.original_url;
                  return src ? (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded bg-primary"
                    >
                      <Image
                        src={src}
                        alt={`${person.name} ${i + 1}`}
                        fill
                        sizes="100px"
                        className="object-cover object-top"
                      />
                    </div>
                  ) : null;
                })}
              </div>
            </SideSection>
          )}

          <SideSection title="General Information">
            <dl>
              <Row label="Name">{person.name}</Row>
              <Row label="Aliases">
                {aliases.length > 0 && (
                  <span className="block space-y-0.5">
                    {aliases.map((a) => (
                      <span key={a} className="block">{a}</span>
                    ))}
                  </span>
                )}
              </Row>
              <Row label="Gender">{GENDERS[person.gender]}</Row>
              <Row label="Born">{formatDate(person.birth)}</Row>
              <Row label="Died">{formatDate(person.death)}</Row>
              <Row label="Hometown">{person.hometown}</Row>
              <Row label="Country">{person.country}</Row>
              <Row label="Website">
                {person.website && (
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-50 hover:underline"
                  >
                    {person.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </Row>
              <Row label="Works">
                {person.volume_credits?.length > 0 &&
                  `${person.volume_credits.length} volumes`}
              </Row>
            </dl>
          </SideSection>

          {createdCharacters.length > 0 && (
            <SideSection title="Created Characters">
              <ul className="px-3 py-2 text-xs space-y-1">
                {createdCharacters.slice(0, 30).map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/comic/character/${c.id}`}
                      className="text-secondary-50 hover:underline"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </SideSection>
          )}
        </aside>
      </div>

      {/* ---------- Works ---------- */}
      {works.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-accent border-b border-secondary-100 pb-3 mb-6">
            Works
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {works.map((v) => {
              const src =
                v.image?.medium_url || v.image?.small_url || PLACEHOLDER_IMAGE;
              return (
                <Link
                  key={v.id}
                  href={`/comic/${v.id}`}
                  className="group text-center"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded bg-primary">
                    <Image
                      src={src}
                      alt={v.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 16vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized={src.startsWith("data:")}
                    />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-accent line-clamp-2 group-hover:underline">
                    {v.name}
                  </p>
                  <p className="text-xs text-accent/50">
                    {[v.start_year, v.publisher?.name].filter(Boolean).join(" • ")}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default Page;