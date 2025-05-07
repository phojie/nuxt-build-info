<script setup lang="ts">
const buildInfo = useBuildInfo()
</script>

<template>
  <div>
    <h1>Build Info</h1>
    <pre>{{ JSON.stringify(buildInfo, null, 2) }}</pre>
  </div>
</template>
