import type { BuildInfo } from './runtime/types'
import fs from 'node:fs'
import { createResolver, defineNuxtModule } from '@nuxt/kit'
import { getEnv } from './runtime/utils/env'

declare global {
  interface ImportMeta {
    env: Record<string, string>
  }
}

export interface ModuleOptions {
  version: string
  disablePublicAssets?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'build-env',
    configKey: 'buildEnv',
  },
  async setup(options, nuxt) {
    const resolver = createResolver(nuxt.options.rootDir)

    const packageJsonPath = resolver.resolve('package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

    if (!packageJson.version) {
      options.version = '0.0.0'
    }

    if (packageJson.version) {
      options.version = packageJson.version
    }

    /**
     * We use this module to inject build info into the app.
     * This is useful for debugging and for displaying the current build info in the app.
     * The build info is also used to determine which public assets to serve.
     */
    const { env, commit, shortCommit, branch } = await getEnv()
    const buildInfo: BuildInfo = {
      version: options.version,
      time: +Date.now(),
      commit,
      shortCommit,
      branch,
      env,
    }

    nuxt.options.appConfig = nuxt.options.appConfig || {}
    nuxt.options.appConfig.env = env
    nuxt.options.appConfig.buildInfo = buildInfo

    nuxt.options.nitro.virtual = nuxt.options.nitro.virtual || {}
    nuxt.options.nitro.virtual['#build-info'] = `export const env = ${JSON.stringify(env)}`

    if (!options.disablePublicAssets) {
      nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || []
    }
  },
})
