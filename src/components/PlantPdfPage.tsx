import type { PlantPage, PlantSpec } from "../types";
import { IconDrop, IconLeaf, IconRuler, IconSun } from "./Icons";

function SpecIcon({ icon }: { icon: PlantSpec["icon"] }) {
  const cls = "text-[#3f5d32]";
  if (icon === "sun") return <IconSun size={15} className={cls} />;
  if (icon === "drop") return <IconDrop size={15} className={cls} />;
  if (icon === "ruler") return <IconRuler size={15} className={cls} />;
  return <IconLeaf size={15} className={cls} />;
}

export function PlantPdfPage({ page, index, total }: { page: PlantPage; index: number; total: number }) {
  const [hero, ...rest] = page.images;
  const thumbs = rest.slice(0, 4);

  return (
    <article className="mx-auto flex h-full w-full max-w-[760px] flex-col bg-[#f4f1e8] px-7 py-6 sm:px-9 sm:py-7">
      <header className="mb-4 flex items-start justify-between gap-4">
        <p className="text-[10px] font-medium tracking-[0.14em] text-[#9a9588] uppercase">
          {page.kicker}
        </p>
        <p className="shrink-0 text-[10px] font-medium tracking-[0.16em] text-[#9a9588]">
          {String(index + 1).padStart(2, "0")} OF {total}
        </p>
      </header>

      <h1 className="text-[34px] leading-[1.05] font-extrabold tracking-tight text-neutral-950 sm:text-[40px]">
        {page.name}
      </h1>
      <p className="font-serif mt-1 text-[20px] text-[#6b6570] italic">{page.latin}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {page.tags.map((t) => (
          <span
            key={t.label}
            className={
              t.tone === "dark"
                ? "rounded-full bg-[#2f4a28] px-3 py-1 text-[11.5px] font-medium text-[#eaf3e4]"
                : t.tone === "muted"
                  ? "rounded-full bg-[#ebe6d8] px-3 py-1 text-[11.5px] font-medium text-[#3f3d36]"
                  : "rounded-full bg-[#e4ecd8] px-3 py-1 text-[11.5px] font-medium text-[#3f5d32]"
            }
          >
            {t.label}
          </span>
        ))}
      </div>

      <div className="mt-5 grid h-[300px] grid-cols-2 grid-rows-2 gap-2 sm:h-[340px] sm:grid-cols-[1.45fr_0.9fr_0.9fr]">
        <div className="col-span-2 row-span-1 overflow-hidden rounded-[10px] sm:col-span-1 sm:row-span-2">
          <img src={hero} alt={page.name} className="h-full w-full object-cover" />
        </div>
        {thumbs.map((src, i) => (
          <div key={src + i} className={`overflow-hidden rounded-[10px] ${i > 1 ? "hidden sm:block" : ""}`}>
            <img src={src} alt="" className="h-full min-h-[88px] w-full object-cover sm:min-h-[136px]" />
          </div>
        ))}
      </div>

      <section className="mt-5 rounded-xl border border-[#e0d9c8] bg-[#f7f4ec] px-4 py-3">
        <h2 className="text-[13px] font-semibold text-[#3f5d32]">About</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-[#3d3a34]">{page.about}</p>
      </section>

      <div className="mt-3 overflow-hidden rounded-xl border border-[#d7e0c8]">
        {page.specs.map((s, i) => (
          <div
            key={s.label}
            className={`grid grid-cols-[132px_1fr] sm:grid-cols-[168px_1fr] ${i ? "border-t border-[#d7e0c8]" : ""}`}
          >
            <div className="flex items-center justify-between gap-2 bg-[#d8e5c8] px-3 py-2.5">
              <span className="text-[13px] font-semibold text-[#2f4a28]">{s.label}</span>
              <SpecIcon icon={s.icon} />
            </div>
            <p className="bg-[#f7f4ec] px-3 py-2.5 text-[12.5px] leading-relaxed text-[#3d3a34]">{s.text}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
