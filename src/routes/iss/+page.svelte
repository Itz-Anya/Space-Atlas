<script>
  import { onMount, onDestroy } from 'svelte';
  import { MapPin, Satellite, Gauge, Mountain, Clock, Navigation, Loader2, RefreshCw } from 'lucide-svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';

  let mapEl;
  let map;
  let issMarker;
  let userMarker;
  let trail;
  const trailCoords = [];

  let position = $state(null);
  let userLoc = $state(null);
  let passes = $state([]);
  let passesLoading = $state(false);
  let passesError = $state(null);
  let posError = $state(null);
  let now = $state(Date.now());

  let posTimer;
  let clockTimer;

  async function fetchPosition() {
    try {
      const r = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      if (!r.ok) throw new Error('position');
      const d = await r.json();
      position = d;
      posError = null;
      updateMap(d.latitude, d.longitude);
    } catch (e) {
      posError = 'Could not reach ISS position service.';
    }
  }

  function updateMap(lat, lon) {
    if (!map || !issMarker) return;
    issMarker.setLatLng([lat, lon]);
    trailCoords.push([lat, lon]);
    if (trailCoords.length > 90) trailCoords.shift();
    trail.setLatLngs(trailCoords);
  }

  async function computePasses(lat, lon) {
    passesLoading = true;
    passesError = null;
    try {
      const tleRes = await fetch(
        'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE'
      );
      const tleText = (await tleRes.text()).trim().split('\n');
      const [, line1, line2] = tleText;
      const sat = await import('satellite.js');
      const satrec = sat.twoline2satrec(line1, line2);

      const observer = {
        latitude: sat.degreesToRadians(lat),
        longitude: sat.degreesToRadians(lon),
        height: 0.1
      };

      const results = [];
      const start = new Date();
      const stepSec = 30;
      const horizonDeg = 10;
      let inPass = false;
      let cur = null;

      for (let s = 0; s < 60 * 60 * 48; s += stepSec) {
        const t = new Date(start.getTime() + s * 1000);
        const pv = sat.propagate(satrec, t);
        if (!pv.position) continue;
        const gmst = sat.gstime(t);
        const ecf = sat.eciToEcf(pv.position, gmst);
        const look = sat.ecfToLookAngles(observer, ecf);
        const elDeg = sat.radiansToDegrees(look.elevation);

        if (elDeg >= horizonDeg && !inPass) {
          inPass = true;
          cur = { start: t, maxEl: elDeg, peak: t };
        } else if (inPass) {
          if (elDeg > cur.maxEl) {
            cur.maxEl = elDeg;
            cur.peak = t;
          }
          if (elDeg < horizonDeg) {
            cur.end = t;
            cur.duration = Math.round((cur.end - cur.start) / 1000);
            results.push(cur);
            inPass = false;
            cur = null;
            if (results.length >= 5) break;
          }
        }
      }
      passes = results;
    } catch (e) {
      passesError = 'Could not compute passes.';
    } finally {
      passesLoading = false;
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      passesError = 'Geolocation not supported.';
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        userLoc = { lat: p.coords.latitude, lon: p.coords.longitude, name: 'Your location' };
        placeUserMarker();
        computePasses(userLoc.lat, userLoc.lon);
      },
      () => (passesError = 'Location permission denied.')
    );
  }

  function placeUserMarker() {
    if (!map || !userLoc) return;
    const L = window.L;
    if (userMarker) userMarker.remove();
    userMarker = L.circleMarker([userLoc.lat, userLoc.lon], {
      radius: 6,
      color: '#22d3ee',
      fillColor: '#22d3ee',
      fillOpacity: 0.9,
      weight: 2
    }).addTo(map);
    userMarker.bindPopup(userLoc.name);
  }

  onMount(async () => {
    const L = (await import('leaflet')).default;
    window.L = L;
    await import('leaflet/dist/leaflet.css');

    map = L.map(mapEl, {
      center: [0, 0],
      zoom: 2,
      worldCopyJump: true,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 8,
      className: 'iss-tiles'
    }).addTo(map);

    const graticule = L.layerGroup();
    for (let lat = -60; lat <= 60; lat += 30) {
      L.polyline([[lat, -180], [lat, 180]], { color: '#f5c542', weight: 0.5, opacity: 0.15, interactive: false }).addTo(graticule);
    }
    for (let lon = -180; lon <= 180; lon += 30) {
      L.polyline([[-85, lon], [85, lon]], { color: '#f5c542', weight: 0.5, opacity: 0.15, interactive: false }).addTo(graticule);
    }
    L.polyline([[0, -180], [0, 180]], { color: '#22d3ee', weight: 0.8, opacity: 0.35, dashArray: '2 6', interactive: false }).addTo(graticule);
    graticule.addTo(map);

    const issIcon = L.divIcon({
      className: 'iss-icon',
      html: `<div class="iss-dot"><div class="iss-pulse"></div><div class="iss-core"></div></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);
    trail = L.polyline([], { color: '#f5c542', weight: 2, opacity: 0.6, dashArray: '4 4' }).addTo(map);

    await fetchPosition();
    posTimer = setInterval(fetchPosition, 5000);
    clockTimer = setInterval(() => (now = Date.now()), 1000);
  });

  onDestroy(() => {
    clearInterval(posTimer);
    clearInterval(clockTimer);
    if (map) map.remove();
  });

  function fmtCountdown(target) {
    const diff = Math.max(0, target.getTime() - now);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  }
  function fmtDuration(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  }
</script>

<svelte:head>
  <title>Live ISS Tracker | SpaceAtlas</title>
  <meta name="description" content="Track the International Space Station live on a world map and see the next visible passes from your location." />
  <link rel="canonical" href="/iss" />
</svelte:head>

<PageHeader
  eyebrow="Low Earth Orbit"
  title="Live ISS Tracker"
  description="The International Space Station orbits Earth every ~92 minutes at 28,000 km/h. Watch it move in real time and see when it flies over you next."
/>

<section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
  <div class="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
    <div class="glass relative overflow-hidden rounded-3xl">
      <div bind:this={mapEl} class="h-[520px] w-full"></div>
      {#if posError}
        <div class="absolute left-4 top-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs text-destructive">{posError}</div>
      {/if}
      <div class="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/10 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
        Updates every 5s · Trail = last 7.5 min
      </div>
    </div>

    <div class="flex flex-col gap-6">
      <div class="glass rounded-3xl p-6">
        <div class="flex items-center gap-3">
          <Satellite class="h-4 w-4 text-gold" />
          <p class="eyebrow">Current position</p>
        </div>
        {#if position}
          <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div class="rounded-xl border border-white/10 bg-white/5 p-3">
              <p class="text-[10px] uppercase tracking-widest text-muted-foreground">Latitude</p>
              <p class="mt-1 font-mono tabular">{position.latitude.toFixed(3)}°</p>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/5 p-3">
              <p class="text-[10px] uppercase tracking-widest text-muted-foreground">Longitude</p>
              <p class="mt-1 font-mono tabular">{position.longitude.toFixed(3)}°</p>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/5 p-3">
              <p class="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1"><Mountain class="h-3 w-3" /> Altitude</p>
              <p class="mt-1 font-mono tabular">{position.altitude.toFixed(1)} km</p>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/5 p-3">
              <p class="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1"><Gauge class="h-3 w-3" /> Velocity</p>
              <p class="mt-1 font-mono tabular">{Math.round(position.velocity).toLocaleString()} km/h</p>
            </div>
          </div>
        {:else}
          <div class="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 class="h-4 w-4 animate-spin" /> Locking on…</div>
        {/if}
      </div>

      <div class="glass rounded-3xl p-6">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <Navigation class="h-4 w-4 text-gold" />
            <p class="eyebrow">Next passes</p>
          </div>
          <button onclick={useMyLocation} class="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:border-gold/40 hover:text-foreground">
            <MapPin class="h-3 w-3" /> Use my location
          </button>
        </div>

        {#if !userLoc}
          <p class="mt-4 text-sm text-muted-foreground">
            Share your location to compute the next times the ISS will be visible above 10° from your horizon over the next 48 hours.
          </p>
        {:else}
          <p class="mt-3 text-[11px] font-mono text-muted-foreground tabular">
            {userLoc.lat.toFixed(3)}°, {userLoc.lon.toFixed(3)}°
            <button onclick={() => computePasses(userLoc.lat, userLoc.lon)} class="ml-2 inline-flex items-center gap-1 text-gold hover:underline"><RefreshCw class="h-3 w-3" /> refresh</button>
          </p>
        {/if}

        {#if passesLoading}
          <div class="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 class="h-4 w-4 animate-spin" /> Computing passes…</div>
        {/if}
        {#if passesError}
          <p class="mt-3 text-sm text-destructive">{passesError}</p>
        {/if}

        {#if passes.length > 0}
          <ul class="mt-4 space-y-2">
            {#each passes as p}
              <li class="rounded-xl border border-white/10 bg-white/5 p-3">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold">{p.start.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    <p class="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground"><Clock class="h-3 w-3" /> {fmtDuration(p.duration)} · peak {Math.round(p.maxEl)}° elevation</p>
                  </div>
                  <div class="text-right">
                    <p class="text-[10px] uppercase tracking-widest text-muted-foreground">In</p>
                    <p class="font-mono text-xs tabular text-gold">{fmtCountdown(p.start)}</p>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  :global(.iss-icon) { background: transparent; border: none; }
  :global(.iss-dot) { position: relative; width: 28px; height: 28px; }
  :global(.iss-core) {
    position: absolute; inset: 10px; border-radius: 999px;
    background: #f5c542; box-shadow: 0 0 12px 2px rgba(245,197,66,0.9);
  }
  :global(.iss-pulse) {
    position: absolute; inset: 0; border-radius: 999px;
    background: rgba(245,197,66,0.35);
    animation: iss-pulse 1.8s ease-out infinite;
  }
  @keyframes iss-pulse {
    0% { transform: scale(0.4); opacity: 0.8; }
    100% { transform: scale(1.6); opacity: 0; }
  }
  :global(.leaflet-container) {
    background: #0a1428 !important;
    font-family: inherit;
  }
  :global(.iss-tiles) {
    filter: brightness(1.55) contrast(1.15) saturate(1.1);
  }
  :global(.leaflet-control-zoom a) {
    background: rgba(15, 20, 35, 0.9) !important;
    color: #e6ecff !important;
    border-color: rgba(255,255,255,0.12) !important;
  }
  :global(.leaflet-control-attribution) {
    background: rgba(15, 20, 35, 0.7) !important;
    color: #94a3b8 !important;
  }
  :global(.leaflet-control-attribution a) { color: #f5c542 !important; }
  :global(.leaflet-popup-content-wrapper), :global(.leaflet-popup-tip) {
    background: rgba(15, 20, 35, 0.95);
    color: #e6ecff;
    border: 1px solid rgba(255,255,255,0.1);
  }
</style>
