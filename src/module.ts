import type { BuildInfo } from './runtime/types'
import { readFileSync } from 'node:fs'
import { addImportsDir, createResolver, defineNuxtModule } from '@nuxt/kit'
import { getEnv } from './runtime/utils/env'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    buildInfo?: Partial<BuildInfo>
  }
  interface AppConfigInput {
    buildInfo?: Partial<BuildInfo>
  }
  interface AppConfig {
    buildInfo: BuildInfo
  }
}

export interface ModuleOptions {
  version?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'build-info',
    configKey: 'buildInfo',
  },
  defaults: {
    version: undefined,
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = resolve('./runtime')

    // Get version from consuming app's package.json
    const packageJsonPath = resolve(nuxt.options.rootDir, 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
    const packageVersion = packageJson.version || '0.0.0'

    /**
     * We use this module to inject build info into the app.
     * This is useful for debugging and for displaying the current build info in the app.
     */
    const { env, commit, shortCommit, branch } = await getEnv()
    const buildInfo: BuildInfo = {
      version: options.version || packageVersion,
      time: +Date.now(),
      commit,
      shortCommit,
      branch,
      env,
    }
    nuxt.options.appConfig = nuxt.options.appConfig || {}
    nuxt.options.appConfig.buildInfo = buildInfo
    nuxt.options.appConfig.env = env

    nuxt.options.nitro.virtual = nuxt.options.nitro.virtual || {}
    nuxt.options.nitro.virtual['#build-info'] = `export const env = ${JSON.stringify(env)}`

    addImportsDir(resolve(runtimeDir, 'composables'))
  },
})
