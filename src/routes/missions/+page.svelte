<script>
  import { ExternalLink } from 'lucide-svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { MISSIONS, TIMELINE } from '$lib/space-data.js';

  const FILTERS = ['All', 'Active', 'Complete', 'Planned'];
  let filter = $state('All');
  const list = $derived(filter === 'All' ? MISSIONS : MISSIONS.filter((m) => m.status === filter));
</script>

<svelte:head>
  <title>NASA Missions & Timeline | SpaceAtlas</title>
  <meta name="description" content="Explore active, completed and planned NASA missions with a scrollable timeline of historic events." />
  <link rel="canonical" href="/missions" />
</svelte:head>

<PageHeader eyebrow="Missions" title="NASA Missions" description="Groundbreaking spacecraft, rovers and telescopes shaping humanity's understanding of the cosmos." />

<section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
  <div class="mb-6 flex flex-wrap gap-2">
    {#each FILTERS as f}
      <button onclick={() => (filter = f)} class="rounded-full border px-4 py-1.5 text-xs font-medium transition {filter === f ? 'border-primary/60 bg-primary/10 text-primary' : 'border-white/10 text-muted-foreground hover:bg-white/5'}">{f}</button>
    {/each}
  </div>

  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each list as m}
      <a href={m.link} target="_blank" rel="noreferrer" class="glass group flex h-full flex-col rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-primary/40">
        <div class="mb-3 flex items-center justify-between">
          <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider {m.status === 'Active' ? 'bg-accent/15 text-accent' : m.status === 'Planned' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-muted-foreground'}">{m.status}</span>
          <ExternalLink class="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <h3 class="font-display text-lg font-bold leading-tight">{m.name}</h3>
        <p class="mt-1 text-xs text-muted-foreground">{m.agency} · {m.category}</p>
        <p class="mt-3 flex-1 text-sm text-muted-foreground">{m.description}</p>
        <p class="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">Launch · {m.launchDate}</p>
      </a>
    {/each}
  </div>

  <div class="mt-16">
    <p class="eyebrow">Timeline</p>
    <h2 class="mt-2 font-display text-3xl">Six decades of exploration.</h2>
    <ol class="mt-8 space-y-4">
      {#each TIMELINE as t}
        <li class="glass flex flex-col gap-1 rounded-2xl p-5 sm:flex-row sm:items-baseline sm:gap-6">
          <span class="font-display text-2xl text-gold shrink-0 w-20">{t.year}</span>
          <div>
            <p class="text-[10px] uppercase tracking-widest text-muted-foreground">{t.date}</p>
            <h3 class="font-display text-base font-semibold">{t.title}</h3>
            <p class="mt-1 text-sm text-muted-foreground">{t.description}</p>
          </div>
        </li>
      {/each}
    </ol>
  </div>
</section>
