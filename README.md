# Nuxt Build Env

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Track deployments with build-time info: version, git details, env context and timestamps for Nuxt apps

## ✨ Features

- 📦 **Version** - Track your application version
- 🔄 **Commit** - Full commit hash for precise tracking
- 📎 **Short Commit** - Abbreviated commit hash for display
- 🌿 **Branch** - Current branch name
- 🚀 **Env** - Environment context (dev, preview, canary, release)
- ⏱️ **Time** - Build timestamp for tracking deployments

### Supported platforms:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Actions
- Standard Git environments

## Quick Setup

Install the module to your Nuxt application with one command:

1. Add `nuxt-build-info` dependency to your project

```bash
# Using pnpm
pnpm add -D @phojie/nuxt-build-info

# Using yarn
yarn add --dev @phojie/nuxt-build-info

# Using npm
npm install --save-dev @phojie/nuxt-build-info
```

2. Add `nuxt-build-info` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    '@phojie/nuxt-build-info'
  ],
  buildInfo: {
    // Optional: Set a custom version instead of package.json version
    version: '1.0.0-custom',
  }
})
```

That's it! You can now use Nuxt Build Env in your Nuxt app ✨

## Usage

### Composables
```.vue
<script setup lang="ts">
const { version, commit, shortCommit, branch, env, time } = useBuildInfo()
</script>

<template>
  <div>
    <h1>Build Env</h1>
    <p>Version: {{ version }}</p>
    <p>Commit: {{ commit }}</p>
  </div>
</template>
```

### App Config
```.vue
<script setup lang="ts">
const { buildInfo } = useAppConfig()
</script>

<template>
  <div>
    <h1>Build Info</h1>
    <pre>{{ JSON.stringify(buildInfo, null, 2) }}</pre>
  </div>
</template>
```

## Contribution

<details>
  <summary>Local development</summary>

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch
```
</details>

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@phojie/nuxt-build-info/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@phojie/nuxt-build-info
[npm-downloads-src]: https://img.shields.io/npm/dm/@phojie/nuxt-build-info.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@phojie/nuxt-build-info
[license-src]: https://img.shields.io/npm/l/@phojie/nuxt-build-info.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@phojie/nuxt-build-info
[nuxt-src]: https://img.shields.io/badge/phojie-020420?logo=phojie
[nuxt-href]: https://github.com/phojie
