import type { BuildInfo, Environment } from './runtime/types'
import { addImportsDir, createResolver, defineNuxtModule } from '@nuxt/kit'
import { getEnv, getGitInfo } from './runtime/utils/env'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    buildEnv?: Partial<BuildInfo>
  }
  interface AppConfigInput {
    buildEnv?: Partial<BuildInfo>
  }
  interface AppConfig {
    buildEnv: BuildInfo
  }
}

export interface ModuleOptions {
  version?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'build-env',
    configKey: 'buildEnv',
  },
  defaults: {
    version: undefined,
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = resolve('./runtime')

    /**
     * We use this module to inject build info into the app.
     * This is useful for debugging and for displaying the current build info in the app.
     */
    const { env, commit, shortCommit, branch } = await getEnv()
    const buildInfo: BuildInfo = {
      version: options.version || '0.0.0',
      time: +Date.now(),
      commit,
      shortCommit,
      branch,
      env,
    }
    nuxt.options.appConfig.buildEnv = buildInfo
    nuxt.options.appConfig = nuxt.options.appConfig || {}
    nuxt.options.appConfig.env = env
    nuxt.options.appConfig.buildInfo = buildInfo

    nuxt.options.nitro.virtual = nuxt.options.nitro.virtual || {}
    nuxt.options.nitro.virtual['#build-info'] = `export const env = ${JSON.stringify(env)}`

    addImportsDir(resolve(runtimeDir, 'composables'))
  },
})
