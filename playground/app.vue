<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <div>
    Nuxt module playground!
    <pre>{{ appConfig }}</pre>
  </div>
</template>
