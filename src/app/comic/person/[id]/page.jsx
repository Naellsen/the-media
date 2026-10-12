import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchComicVine } from "@/utils/api";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750'><rect width='100%' height='100%' fill='%231f2937'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='24'>No Image</text></svg>";

async function getPerson(id) {
  const data = await fetchComicVine(`person/4040-${id}`, {
    field_list:
      "id,name,deck,description,image,birth,death,hometown,country,website,volume_credits",
  });
  return data && !Array.isArray(data) ? data : null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const person = await getPerson(id);
  return { title: person?.name || "Creator" };
}

const Page = async ({ params }) => {
  const { id } = await params;
  const person = await getPerson(id);

  if (!person) notFound();

  const image =
    person.image?.super_url ||
    person.image?.original_url ||
    person.image?.medium_url ||
    PLACEHOLDER_IMAGE;

  const birth = person.birth ? String(person.birth).slice(0, 10) : null;
  const death = person.death ? String(person.death).slice(0, 10) : null;
  const volumes = (person.volume_credits || []).slice(0, 30);

  const details = [
    ["Born", birth],
    ["Died", death],
    ["Hometown", person.hometown],
    ["Country", person.country],
  ].filter(([, value]) => value);

  return (
    <div className="container mx-auto p-4 space-y-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-72 aspect-2/3 shrink-0 rounded-lg overflow-hidden bg-slate-950">
          <Image
            src={image}
            alt={person.name}
            fill
            sizes="(max-width: 768px) 100vw, 288px"
            className="object-cover"
            priority
            unoptimized={image.startsWith("data:")}
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-accent">{person.name}</h1>

          {details.length > 0 && (
            <dl className="text-sm grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
              {details.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="font-semibold text-slate-200">{label}</dt>
                  <dd className="text-slate-400">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {person.deck && <p className="text-slate-300">{person.deck}</p>}

          {person.description && (
            <div
              className="text-slate-300 text-sm space-y-2"
              dangerouslySetInnerHTML={{ __html: person.description }}
            />
          )}
        </div>
      </div>

      {volumes.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-accent border-b border-slate-700 pb-3 mb-4">
            Works
          </h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 text-sm">
            {volumes.map((v) => (
              <li key={v.id}>
                <Link
                  href={`/comic/${v.id}`}
                  className="text-slate-300 hover:underline"
                >
                  {v.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default Page;