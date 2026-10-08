import { useState } from 'react';
import { Play } from 'lucide-react';
import type { Video } from '../catalog';

/**
 * Plays videos inside the site (official YouTube embed, privacy-enhanced domain).
 * The iframe only loads after a tap, so pages stay fast on budget phones.
 */
export function YouTubePlayer({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const v = videos[active];
  if (!v) return null;

  const src = `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div>
        <div className="relative aspect-video overflow-hidden rounded-card border border-line bg-black">
          {playing ? (
            <iframe
              key={v.id}
              src={src}
              title={v.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 cursor-pointer" aria-label={`Play ${v.title}`}>
              <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" className="h-full w-full object-cover opacity-80 transition-opacity duration-200 group-hover:opacity-100" loading="lazy" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-brand text-on-brand transition-transform duration-150 group-hover:scale-105">
                  <Play size={22} fill="currentColor" className="ml-0.5" />
                </span>
              </span>
            </button>
          )}
        </div>
        <p className="mt-3 text-[15px] font-medium leading-snug">{v.title}</p>
        <p className="text-sm text-sub">{v.channel}</p>
      </div>

      {/* Phones: a swipeable row, so the notes below stay close. Large screens: a list beside the player. */}
      <ol className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0" aria-label="Videos for this topic">
        {videos.map((x, i) => (
          <li key={x.id} className="w-64 shrink-0 snap-start lg:w-auto">
            <button
              type="button"
              onClick={() => { setActive(i); setPlaying(true); }}
              className={`flex w-full gap-3 rounded-lg border p-2 text-left transition-colors duration-150 ${
                i === active ? 'border-brand/60 bg-brand/5' : 'border-transparent hover:bg-raised'
              }`}
            >
              <span className="relative h-[54px] w-24 shrink-0 overflow-hidden rounded-md bg-raised">
                <img src={`https://i.ytimg.com/vi/${x.id}/mqdefault.jpg`} alt="" className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute bottom-1 left-1 rounded bg-black/75 px-1 font-mono text-[10px] text-white">{i + 1}</span>
              </span>
              <span className="min-w-0">
                <span className="line-clamp-2 text-[13px] font-medium leading-snug">{x.title}</span>
                <span className="mt-0.5 block truncate text-xs text-sub">{x.channel}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
