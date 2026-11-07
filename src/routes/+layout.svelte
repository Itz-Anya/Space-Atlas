<script>
  import '../app.css';
  import SiteLayout from '$lib/components/SiteLayout.svelte';
  let { children } = $props();
</script>

<svelte:head>
  <title>SpaceAtlas: Explore the Universe Through NASA Data</title>
  <meta name="description" content="SpaceAtlas is a free, open-source NASA data explorer: APOD, Mars rovers, asteroids, Earth imagery, missions and a live space dashboard." />
</svelte:head>

<SiteLayout>{@render children()}</SiteLayout>
