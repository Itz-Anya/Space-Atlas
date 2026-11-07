<script>
  import { Canvas } from '@threlte/core';
  import SolarSystemScene from './SolarSystemScene.svelte';

  let { selectedSlug = 'earth', onSelect } = $props();
</script>

<Canvas>
  <SolarSystemScene {selectedSlug} {onSelect} />
</Canvas>
