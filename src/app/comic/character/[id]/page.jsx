import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchComicVine } from "@/utils/api";
import { cleanComicHtml } from "@/utils/sanitize";
import WikiContent from "@/components/WikiContents";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750'><rect width='100%' height='100%' fill='%231f2937'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='24'>No Image</text></svg>";

const GENDERS = { 1: "Male", 2: "Female", 0: "Other" };

async function getCharacter(id) {
  const data = await fetchComicVine(`character/4005-${id}`, {
    field_list: [
      "id", "name", "real_name", "aliases", "deck", "description", "image",
      "images", "publisher", "creators", "gender", "origin", "birth",
      "powers", "first_appeared_in_issue", "count_of_issue_appearances",
      "issues_died_in", "teams", "team_friends", "team_enemies",
      "character_friends", "character_enemies", "issue_credits",
    ].join(","),
  });
  return data && !Array.isArray(data) ? data : null;
}

// Newest issues the character appears in, with covers, in ONE extra request
async function getRecentIssues(credits, limit = 9) {
  if (!Array.isArray(credits) || credits.length === 0) return [];

  const ids = [...credits]
    .sort((a, b) => b.id - a.id)
    .slice(0, limit)
    .map((c) => c.id);

  const data = await fetchComicVine("issues", {
    filter: `id:${ids.join("|")}`,
    sort: "store_date:desc",
    limit,
    field_list: "id,name,issue_number,image,volume",
  });
  return Array.isArray(data) ? data : [];
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const character = await getCharacter(id);
  return { title: character?.name || "Character" };
}

function Row({ label, children }) {
  if (!children) return null;
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 px-3 py-2 border-b border-slate-800 text-xs">
      <dt className="font-semibold text-slate-200">{label}</dt>
      <dd className="text-slate-400">{children}</dd>
    </div>
  );
}

function SideSection({ title, children }) {
  return (
    <section className="rounded border border-slate-800 bg-slate-900/50">
      <h2 className="px-3 py-2 text-sm font-bold text-slate-100 border-b border-slate-800">
        {title}
      </h2>
      {children}
    </section>
  );
}

function CharacterLinks({ list }) {
  return (
    <ul className="px-3 py-2 text-xs space-y-1">
      {list.map((c) => (
        <li key={c.id}>
          <Link href={`/comic/character/${c.id}`} className="text-slate-300 hover:underline">
            {c.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function NameList({ list }) {
  return (
    <ul className="px-3 py-2 text-xs space-y-1 text-slate-300">
      {list.map((t) => (
        <li key={t.id}>{t.name}</li>
      ))}
    </ul>
  );
}

const Page = async ({ params }) => {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) notFound();

  const image =
    character.image?.original_url ||
    character.image?.super_url ||
    character.image?.medium_url ||
    PLACEHOLDER_IMAGE;

  const aliases = (character.aliases || "")
    .split("\n")
    .map((a) => a.trim())
    .filter(Boolean);

  const first = character.first_appeared_in_issue;
  const died = character.issues_died_in?.[0];
  const powers = character.powers || [];
  const creators = character.creators || [];
  const gallery = (character.images || []).slice(0, 9);

  const teams = character.teams || [];
  const friends = character.character_friends || [];
  const enemies = character.character_enemies || [];
  const teamFriends = character.team_friends || [];
  const teamEnemies = character.team_enemies || [];

  const recentIssues = await getRecentIssues(character.issue_credits);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-6">
          <h1 className="text-3xl font-bold text-accent">{character.name}</h1>

          {character.deck && (
            <p className="text-lg text-slate-300">{character.deck}</p>
          )}

          {character.description ? (
              <WikiContent html={character.description}/>
            ) : (
              <p className="text-slate-500 text-sm">No description available.</p>
          )}
        </div>

        <aside className="w-full lg:w-80 shrink-0 space-y-4">
          <Image
            src={image}
            alt={character.name}
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
                    <div key={i} className="relative aspect-square overflow-hidden rounded bg-slate-950">
                      <Image
                        src={src}
                        alt={`${character.name} ${i + 1}`}
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
              <Row label="Super Name">{character.name}</Row>
              <Row label="Real Name">{character.real_name}</Row>
              <Row label="Aliases">
                {aliases.length > 0 && (
                  <span className="block space-y-0.5">
                    {aliases.map((a) => (
                      <span key={a} className="block">{a}</span>
                    ))}
                  </span>
                )}
              </Row>
              <Row label="Publisher">{character.publisher?.name}</Row>
              <Row label="Creators">
                {creators.length > 0 && (
                  <span className="block space-y-0.5">
                    {creators.map((p) => (
                      <Link key={p.id} href={`/comic/person/${p.id}`} className="block text-slate-300 hover:underline">
                        {p.name}
                      </Link>
                    ))}
                  </span>
                )}
              </Row>
              <Row label="Gender">{GENDERS[character.gender]}</Row>
              <Row label="Character Type">{character.origin?.name}</Row>
              <Row label="First Appearance">
                {first?.id && (
                  <Link href={`/comic/issue/${first.id}`} className="text-slate-300 hover:underline">
                    {first.name || `Issue #${first.issue_number}`}
                  </Link>
                )}
              </Row>
              <Row label="Appears in">
                {character.count_of_issue_appearances != null &&
                  `${character.count_of_issue_appearances} issues`}
              </Row>
              <Row label="Birthday">{character.birth}</Row>
              <Row label="Died">
                {died?.id ? (
                  <Link href={`/comic/issue/${died.id}`} className="text-slate-300 hover:underline">
                    {died.name || `Issue #${died.issue_number}`}
                  </Link>
                ) : (
                  "None"
                )}
              </Row>
              <Row label="Powers">
                {powers.length > 0 && (
                  <span className="block space-y-0.5">
                    {powers.map((p) => (
                      <span key={p.id} className="block">{p.name}</span>
                    ))}
                  </span>
                )}
              </Row>
            </dl>
          </SideSection>

          {teams.length > 0 && (
            <SideSection title="Teams">
              <NameList list={teams} />
            </SideSection>
          )}

          {(friends.length > 0 || teamFriends.length > 0) && (
            <SideSection title="Friends">
              {friends.length > 0 && <CharacterLinks list={friends} />}
              {teamFriends.length > 0 && <NameList list={teamFriends} />}
            </SideSection>
          )}

          {(enemies.length > 0 || teamEnemies.length > 0) && (
            <SideSection title="Enemies">
              {enemies.length > 0 && <CharacterLinks list={enemies} />}
              {teamEnemies.length > 0 && <NameList list={teamEnemies} />}
            </SideSection>
          )}

          {recentIssues.length > 0 && (
            <SideSection title="Recent issues">
              <div className="grid grid-cols-3 gap-2 p-2">
                {recentIssues.map((issue) => {
                  const src = issue.image?.medium_url || issue.image?.small_url;
                  return (
                    <Link
                      key={issue.id}
                      href={`/comic/issue/${issue.id}`}
                      title={`${issue.volume?.name || ""} #${issue.issue_number}`}
                      className="relative aspect-2/3 overflow-hidden rounded bg-slate-950 hover:opacity-80"
                    >
                      {src && (
                        <Image
                          src={src}
                          alt={issue.name || `Issue #${issue.issue_number}`}
                          fill
                          sizes="100px"
                          className="object-cover"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </SideSection>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Page;