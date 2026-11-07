<script>
  import { onMount } from 'svelte';
  import { ArrowUpRight, Rocket, Camera, Globe2, Orbit, Sparkles, Telescope, Search, Play } from 'lucide-svelte';
  import { nasa } from '$lib/nasa.js';

  const SECTIONS = [
    { to: '/apod', n: '01', label: 'Picture of the Day', icon: Camera, desc: "One image, hand-picked by NASA astronomers. Every day since 1995." },
    { to: '/mars', n: '02', label: 'Mars Rover Archive', icon: Rocket, desc: 'Raw imagery from Curiosity, Perseverance, Opportunity and Spirit.' },
    { to: '/asteroids', n: '03', label: 'Near-Earth Objects', icon: Orbit, desc: 'Track asteroids passing close to our planet in real time.' },
    { to: '/earth', n: '04', label: 'Earth from Orbit', icon: Globe2, desc: 'EPIC full-disk imagery of our pale blue home.' },
    { to: '/gallery', n: '05', label: 'Image Library', icon: Sparkles, desc: "Search through decades of NASA's photographic record." },
    { to: '/solar-system', n: '06', label: 'Solar System', icon: Telescope, desc: 'An interactive tour of the eight planets and their orbits.' }
  ];

  let apod = $state(null);
  let q = $state('');
  onMount(async () => { try { apod = await nasa.apod(); } catch {} });

  function submitSearch(e) {
    e.preventDefault();
    if (q.trim()) window.location.href = `/explore?q=${encodeURIComponent(q)}`;
  }
</script>

<svelte:head>
  <title>SpaceAtlas: Explore the Universe Through NASA Data</title>
  <meta property="og:title" content="SpaceAtlas: Explore the Universe Through NASA Data" />
  <meta property="og:url" content="/" />
  <link rel="canonical" href="/" />
</svelte:head>

<section class="relative overflow-hidden">
  <div class="absolute inset-0 -z-10">
    <img src="/assets/hero-nebula.jpg" alt="" width="1920" height="1280" class="h-full w-full object-cover opacity-60" />
    <div class="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent"></div>
  </div>

  <div class="mx-auto grid max-w-7xl gap-10 px-4 pt-10 pb-20 sm:px-6 sm:pt-14 sm:pb-28 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pt-16">
    <div>
      <div class="flex items-center gap-4">
        <span class="eyebrow">Vol. I · Est. 2026</span>
        <span class="h-px w-16 bg-white/20"></span>
        <span class="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Powered by NASA Open APIs</span>
      </div>
      <h1 class="mt-6 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-[5.5rem]">
        An atlas of<br />the <em class="font-normal italic text-gold">observable</em><br />universe.
      </h1>
      <p class="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
        SpaceAtlas is a free, open-source way to explore NASA's public data, organised and illustrated for anyone who has ever looked up at the night sky.
      </p>

      <form onsubmit={submitSearch} class="mt-8 flex max-w-lg items-center gap-2 rounded-full border border-white/15 bg-background/60 p-1.5 backdrop-blur-xl focus-within:border-gold/50">
        <Search class="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
        <input bind:value={q} type="search" placeholder="Search galaxies, missions, planets…" class="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground" aria-label="Search NASA content" />
        <button class="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-110">Explore</button>
      </form>

      <div class="mt-10 flex flex-wrap items-center gap-6 text-sm">
        <a href="/dashboard" class="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-gold">Open the dashboard <ArrowUpRight class="h-4 w-4" /></a>
        <span class="h-4 w-px bg-white/15"></span>
        <a href="/solar-system" class="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"><Play class="h-3.5 w-3.5" /> Tour the solar system</a>
      </div>
    </div>

    <aside class="relative">
      <a href="/apod" class="group block overflow-hidden rounded-sm border border-white/10 bg-background/80 backdrop-blur-xl">
        <div class="relative aspect-[4/5] w-full overflow-hidden">
          {#if apod?.media_type === 'image'}
            <img src={apod.url} alt={apod.title} class="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" loading="eager" />
          {:else if apod?.media_type === 'video'}
            <div class="h-full w-full bg-black"><iframe title={apod.title} src={apod.url} class="h-full w-full" allowfullscreen></iframe></div>
          {:else}
            <div class="h-full w-full animate-pulse bg-white/5"></div>
          {/if}
          <div class="absolute inset-x-0 top-0 flex items-center justify-between p-4 text-[10px] font-mono uppercase tracking-widest text-white/80">
            <span>NASA / APOD</span><span class="tabular">{apod?.date ?? '····-··-··'}</span>
          </div>
        </div>
        <div class="border-t border-white/10 p-5">
          <p class="eyebrow">Astronomy Picture of the Day</p>
          <h3 class="mt-2 font-display text-xl leading-tight">{apod?.title ?? "Loading today's cosmic view…"}</h3>
          <span class="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-gold">Read entry <ArrowUpRight class="h-3.5 w-3.5" /></span>
        </div>
      </a>
    </aside>
  </div>
</section>

<section class="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
  <div class="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 pb-10">
    <div>
      <p class="eyebrow">The Atlas · Six Chapters</p>
      <h2 class="mt-3 font-display text-3xl sm:text-5xl">Every corner of the catalog.</h2>
    </div>
    <a href="/explore" class="hidden text-sm font-semibold text-muted-foreground hover:text-gold sm:inline-flex sm:items-center sm:gap-1">Full index <ArrowUpRight class="h-4 w-4" /></a>
  </div>

  <div class="grid border-t border-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
    {#each SECTIONS as item, i}
      <div class="border-b border-white/[0.08] {i % 3 !== 2 ? 'lg:border-r' : ''} {i % 2 === 0 ? 'sm:border-r lg:border-r' : ''} {i % 3 === 2 ? 'lg:border-r-0' : ''}">
        <a href={item.to} class="group relative flex h-full flex-col gap-6 p-6 transition-colors hover:bg-white/[0.03] sm:p-8">
          <div class="flex items-start justify-between">
            <span class="font-mono text-[11px] tracking-widest text-muted-foreground">{item.n}</span>
            <item.icon class="h-5 w-5 text-gold" strokeWidth={1.5} />
          </div>
          <div>
            <h3 class="font-display text-2xl leading-tight">{item.label}</h3>
            <p class="mt-3 max-w-xs text-sm text-muted-foreground">{item.desc}</p>
          </div>
          <span class="mt-auto inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-gold">Enter <ArrowUpRight class="h-3.5 w-3.5" /></span>
        </a>
      </div>
    {/each}
  </div>
</section>
