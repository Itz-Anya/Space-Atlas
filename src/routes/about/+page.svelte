<script>
  import { Code2, Github, ArrowUpRight, Bug, Rocket, Sparkles, Globe2 } from 'lucide-svelte';

  const CREATORS = [
    {
      key: 'murali',
      plain: 'Murali',
      name: '𝐌 𝐔 𝐑 𝚨 𝐋 𝐈 ',
      handle: 'Itz-Murali',
      img: 'https://itz-murali-images.vercel.app/api',
      banner: 'https://random-images-anya.vercel.app/bm',
      role: 'Senior Developer',
      about: 'Itz-Murali is the senior developer of SpaceAtlas. He built the NASA API proxy and the download route, looks after the backend, and reviews and ships the bigger changes.',
      focus: ['Architecture', 'Backend', 'Code Review']
    },
    {
      key: 'anya',
      plain: 'Anya',
      name: '𝚨𝝒𝛄ꫝ',
      handle: 'Itz-Anya',
      img: 'https://random-images-anya.vercel.app/anya',
      banner: 'https://random-images-anya.vercel.app/ba',
      role: 'Junior Developer',
      about: 'Itz-Anya is the junior developer of SpaceAtlas and the face behind the Anya brand. She builds the interface details, polishes the look and feel, and keeps learning with every release.',
      focus: ['Interface', 'Design', 'Docs']
    }
  ];

  const STACK = ['SvelteKit', 'Threlte', 'Tailwind CSS', 'NASA Open APIs'];
  const githubUrl = (handle) => `https://github.com/${handle}`;
  const FALLBACK_IMG = '/assets/logo.png';

  const FEATURES = [
    { Icon: Sparkles, title: 'APOD Archive', desc: "NASA's Astronomy Picture of the Day with a full browsable history." },
    { Icon: Globe2, title: 'Earth & Mars', desc: 'Live EPIC imagery of Earth and daily Curiosity and Perseverance photos.' },
    { Icon: Rocket, title: 'ISS Tracker', desc: 'Real-time position on a world map plus the next pass over your location.' }
  ];

  let brokenBanner = $state({});
  let brokenAvatar = $state({});
</script>

<svelte:head>
  <title>About | SpaceAtlas</title>
  <meta name="description" content="About SpaceAtlas, a free, open-source NASA data atlas made by Anya and Murali." />
  <meta property="og:title" content="About SpaceAtlas" />
  <meta property="og:description" content="A free, open-source NASA data atlas made by Anya and Murali." />
</svelte:head>

<section class="relative">
  <div class="mx-auto max-w-6xl px-4 pt-14 pb-8 sm:px-6 sm:pt-20">
    <div class="flex flex-col items-center text-center">
      <span class="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-3xl border border-white/15 bg-background shadow-2xl shadow-black/50 sm:h-28 sm:w-28">
        <img src="/assets/logo.png" alt="SpaceAtlas logo" class="h-full w-full object-cover" />
      </span>
      <span class="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
        <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-gold"></span> About the Project
      </span>
      <h1 class="mt-5 font-display text-4xl leading-[1.05] sm:text-6xl">
        Space<span class="text-gold">Atlas</span>
      </h1>
      <p class="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        A free, open-source atlas of the observable universe, built entirely on NASA's public data.
        Explore APOD, Mars rovers, near-Earth objects, live ISS tracking and more from any device.
      </p>
    </div>

    <div class="mt-12 grid gap-4 sm:grid-cols-3">
      {#each FEATURES as f}
        <div class="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:bg-white/[0.06]">
          <span class="grid h-10 w-10 place-items-center rounded-xl bg-gold/10 text-gold">
            <f.Icon class="h-5 w-5" />
          </span>
          <p class="mt-4 font-display text-lg">{f.title}</p>
          <p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<section class="relative" aria-labelledby="creators-h">
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
    <div class="mx-auto mb-10 max-w-2xl text-center">
      <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">The Team</p>
      <h2 id="creators-h" class="mt-2 font-display text-3xl sm:text-4xl">Creators</h2>
      <p class="mt-3 text-sm leading-relaxed text-muted-foreground">The people who built and run SpaceAtlas. Questions, bug reports and ideas are always welcome on GitHub.</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      {#each CREATORS as c (c.key)}
        <article class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl hover:shadow-black/40">
          <div class="relative h-32 w-full overflow-hidden bg-gradient-to-br from-white/10 to-transparent sm:h-40" aria-hidden="true">
            {#if c.banner && !brokenBanner[c.key]}
              <img
                src={c.banner}
                alt=""
                width="1200"
                height="400"
                loading="lazy"
                decoding="async"
                referrerpolicy="no-referrer"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                onerror={() => (brokenBanner[c.key] = true)}
              />
            {/if}
            <span class="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></span>
          </div>

          <div class="relative px-6 pb-6 sm:px-7 sm:pb-7">
            <div class="-mt-14 flex items-end justify-between gap-3 sm:-mt-16">
              <span class="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-background bg-background shadow-xl shadow-black/50 sm:h-28 sm:w-28">
                <img
                  src={brokenAvatar[c.key] || !c.img ? FALLBACK_IMG : c.img}
                  alt={c.plain}
                  width="160"
                  height="160"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                  class="h-full w-full object-cover"
                  onerror={() => (brokenAvatar[c.key] = true)}
                />
              </span>
              <b class="mb-1 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold">{c.role}</b>
            </div>

            <h3 class="mt-4 font-display text-2xl" aria-label={c.plain}><span aria-hidden="true">{c.name}</span></h3>
            <a href={githubUrl(c.handle)} target="_blank" rel="noopener noreferrer" class="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-gold">
              <Github class="h-3.5 w-3.5" /> @{c.handle}
            </a>

            <div class="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p class="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">About</p>
              <p class="mt-2 text-sm leading-relaxed text-foreground/85">{c.about}</p>
              <ul class="mt-3 flex flex-wrap gap-1.5">
                {#each c.focus as f}
                  <li class="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-muted-foreground">{f}</li>
                {/each}
              </ul>
            </div>

            <div class="mt-5 flex flex-wrap gap-2.5">
              <a
                href={githubUrl(c.handle)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${c.handle} on GitHub`}
                class="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-105"
              >
                <Github class="h-4 w-4" /> View Profile
              </a>
              <a
                href={`${githubUrl(c.handle)}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-semibold transition-colors hover:border-gold/40 hover:bg-white/[0.07]"
              >
                <Code2 class="h-4 w-4" /> Repositories
              </a>
            </div>
          </div>
        </article>
      {/each}
    </div>

    <div class="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 sm:flex-row">
      <div class="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        <span class="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Built With</span>
        <ul class="flex flex-wrap gap-1.5">
          {#each STACK as item}
            <li class="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-foreground/85">{item}</li>
          {/each}
        </ul>
      </div>
      <a
        href="https://github.com/Itz-Anya/Space-Atlas/issues"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-105"
      >
        <Bug class="h-4 w-4" /> Report a Bug or Share an Idea <ArrowUpRight class="h-3.5 w-3.5" />
      </a>
    </div>
  </div>
</section>

<section class="relative">
  <div class="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
    <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 text-center sm:p-10">
      <p class="font-display text-2xl sm:text-3xl">Built with NASA Open APIs</p>
      <p class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Not affiliated with NASA. All imagery and data belong to their respective owners. The project is open source and free to use.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer noopener" class="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-105">
          api.nasa.gov <ArrowUpRight class="h-4 w-4" />
        </a>
        <a href="/dashboard" class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold transition-colors hover:border-gold/40 hover:bg-white/[0.07]">
          Open Dashboard
        </a>
      </div>
    </div>
  </div>
</section>
