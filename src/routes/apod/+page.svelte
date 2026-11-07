<script>
  import { Download, Calendar, Heart, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { nasa, todayISO } from '$lib/nasa.js';
  import { favorites } from '$lib/favorites.js';

  let date = $state(todayISO());
  let data = $state(null);
  let loading = $state(false);
  let error = $state(null);
  let downloading = $state(false);
  let favs = $state([]);
  favorites.subscribe((v) => (favs = v));

  const isFav = $derived(data ? favs.some((f) => f.id === `apod-${data.date}`) : false);

  async function load(d) {
    loading = true; error = null;
    try { data = await nasa.apod(d); } catch (e) { error = e; } finally { loading = false; }
  }
  $effect(() => { load(date); });

  function shift(delta) {
    const dt = new Date(date); dt.setDate(dt.getDate() + delta);
    date = dt.toISOString().slice(0, 10);
  }

  async function handleDownload() {
    if (!data || data.media_type !== 'image') return;
    const url = data.hdurl || data.url;
    const ext = (url.split('.').pop() || 'jpg').split('?')[0].slice(0, 4);
    const safe = data.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 60);
    const filename = `apod-${data.date}-${safe}.${ext}`;
    downloading = true;
    try {
      const proxied = `/api/public/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
      const res = await fetch(proxied);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } finally { downloading = false; }
  }
</script>

<svelte:head>
  <title>Astronomy Picture of the Day | SpaceAtlas</title>
  <meta name="description" content="NASA's Astronomy Picture of the Day in HD with full explanation, date selector, share and download." />
  <link rel="canonical" href="/apod" />
</svelte:head>

<PageHeader eyebrow="APOD" meta={date} title="Astronomy Picture of the Day" description="Every day a new image of our universe, hand-picked and paired with a short note from a professional astronomer." />

<section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
  <div class="mb-8 grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
    <div class="flex items-center gap-1 rounded-full border border-white/10 bg-background/60 p-1 backdrop-blur">
      <button onclick={() => shift(-1)} disabled={date <= '1995-06-16'} class="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground disabled:opacity-40" aria-label="Previous day"><ChevronLeft class="h-4 w-4" /></button>
      <label class="flex items-center gap-2 px-2 text-sm">
        <Calendar class="h-3.5 w-3.5 text-muted-foreground" />
        <input type="date" bind:value={date} max={todayISO()} min="1995-06-16" class="bg-transparent text-sm outline-none tabular" />
      </label>
      <button onclick={() => shift(1)} disabled={date >= todayISO()} class="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground disabled:opacity-40" aria-label="Next day"><ChevronRight class="h-4 w-4" /></button>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      {#if data && data.media_type === 'image'}
        <button onclick={handleDownload} disabled={downloading} class="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:border-white/25 hover:text-foreground disabled:opacity-60">
          <Download class="h-3.5 w-3.5" /> {downloading ? 'Preparing…' : 'Download HD'}
        </button>
      {/if}
      {#if data}
        <button onclick={() => favorites.toggle({ id: `apod-${data.date}`, type: 'image', title: data.title, url: data.hdurl || data.url, thumb: data.url, meta: data.date })} class="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest {isFav ? 'border-gold/50 bg-gold/10 text-gold' : 'border-white/10 text-muted-foreground hover:border-white/25 hover:text-foreground'}">
          <Heart class="h-3.5 w-3.5 {isFav ? 'fill-current' : ''}" /> {isFav ? 'Saved' : 'Save'}
        </button>
      {/if}
    </div>
  </div>

  {#if error}<p class="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">Could not load APOD. Try another date.</p>{/if}
  {#if loading}<div class="aspect-video w-full animate-pulse rounded-lg bg-white/5"></div>{/if}

  {#if data}
    <article class="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <div class="overflow-hidden rounded-sm border border-white/10 bg-black/40">
        {#if data.media_type === 'image'}
          <img src={data.hdurl || data.url} alt={data.title} class="w-full" />
        {:else}
          <div class="aspect-video"><iframe title={data.title} src={data.url} class="h-full w-full" allowfullscreen></iframe></div>
        {/if}
      </div>
      <div>
        <div class="flex items-center gap-3">
          <span class="eyebrow">Entry</span>
          <span class="h-px w-8 bg-white/15"></span>
          <span class="font-mono text-[11px] uppercase tracking-widest text-muted-foreground tabular">{data.date}</span>
        </div>
        <h2 class="mt-4 font-display text-3xl leading-tight sm:text-4xl">{data.title}</h2>
        {#if data.copyright}<p class="mt-2 text-xs text-muted-foreground">© {data.copyright.trim()}</p>{/if}
        <div class="rule my-6"></div>
        <p class="text-[15px] leading-relaxed text-muted-foreground">{data.explanation}</p>
      </div>
    </article>
  {/if}
</section>
