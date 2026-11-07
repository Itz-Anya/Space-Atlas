<script>
  import { onMount } from 'svelte';
  import { AlertTriangle, Gauge, Ruler, Orbit } from 'lucide-svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { nasa, todayISO } from '$lib/nasa.js';

  const start = todayISO();
  const end = todayISO(6);
  let data = $state(null);
  let loading = $state(true);

  onMount(async () => {
    try { data = await nasa.neoFeed(start, end); } finally { loading = false; }
  });

  const all = $derived.by(() => {
    if (!data) return [];
    return Object.entries(data.near_earth_objects)
      .flatMap(([date, arr]) => arr.map((a) => ({ ...a, _date: date })))
      .sort((a, b) => a._date.localeCompare(b._date));
  });

  const stats = $derived.by(() => {
    const hazardous = all.filter((a) => a.is_potentially_hazardous_asteroid).length;
    const largest = all.reduce((m, a) => Math.max(m, a.estimated_diameter.kilometers.estimated_diameter_max), 0);
    const fastest = all.reduce((m, a) => Math.max(m, Number(a.close_approach_data[0]?.relative_velocity.kilometers_per_hour || 0)), 0);
    return { total: all.length, hazardous, largest, fastest };
  });
</script>

<svelte:head>
  <title>Near-Earth Asteroids | SpaceAtlas</title>
  <meta name="description" content="Track near-Earth asteroids for the next 7 days: sizes, velocities, distances, and hazard indicators." />
  <link rel="canonical" href="/asteroids" />
</svelte:head>

<PageHeader eyebrow="Chapter 03 · Near-Earth Objects" meta="NASA / NeoWs" title="Asteroid watch." description="Real-time tracking of asteroids making a close approach to Earth over the next seven days." heroImage="/assets/asteroid-hero.jpg" />

<section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
  <div class="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
    {#each [
      { icon: Orbit, label: 'Total tracked', value: stats.total.toString(), tone: '' },
      { icon: AlertTriangle, label: 'Potentially hazardous', value: stats.hazardous.toString(), tone: 'danger' },
      { icon: Ruler, label: 'Largest (km)', value: stats.largest.toFixed(2), tone: '' },
      { icon: Gauge, label: 'Fastest (km/h)', value: Math.round(stats.fastest).toLocaleString(), tone: '' }
    ] as s}
      <div class="glass rounded-2xl p-4">
        <div class="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <s.icon class="h-3.5 w-3.5 {s.tone === 'danger' ? 'text-destructive' : 'text-primary'}" /> {s.label}
        </div>
        <div class="mt-2 font-display text-2xl font-bold {s.tone === 'danger' ? 'text-destructive' : 'text-gold'}">{s.value}</div>
      </div>
    {/each}
  </div>

  {#if loading}
    <div class="grid gap-3">{#each Array(6) as _}<div class="h-20 animate-pulse rounded-xl bg-white/5"></div>{/each}</div>
  {/if}

  <div class="grid gap-3">
    {#each all as a}
      {@const d = a.close_approach_data[0]}
      <a href={a.nasa_jpl_url} target="_blank" rel="noreferrer" class="glass grid gap-3 rounded-2xl p-4 transition-colors hover:border-primary/40 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto] sm:items-center">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="truncate font-display text-base font-semibold">{a.name}</h3>
            {#if a.is_potentially_hazardous_asteroid}
              <span class="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-destructive"><AlertTriangle class="h-3 w-3" /> Hazard</span>
            {/if}
          </div>
          <p class="mt-0.5 text-xs text-muted-foreground">Approach {a._date}</p>
        </div>
        <div><div class="text-[10px] uppercase tracking-widest text-muted-foreground">Diameter</div><div class="font-mono text-xs sm:text-sm">{a.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} to {a.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</div></div>
        <div><div class="text-[10px] uppercase tracking-widest text-muted-foreground">Velocity</div><div class="font-mono text-xs sm:text-sm">{d ? `${Math.round(Number(d.relative_velocity.kilometers_per_hour)).toLocaleString()} km/h` : 'N/A'}</div></div>
        <div><div class="text-[10px] uppercase tracking-widest text-muted-foreground">Miss distance</div><div class="font-mono text-xs sm:text-sm">{d ? `${Math.round(Number(d.miss_distance.kilometers)).toLocaleString()} km` : 'N/A'}</div></div>
        <span class="text-xs text-accent">JPL →</span>
      </a>
    {/each}
  </div>
</section>
