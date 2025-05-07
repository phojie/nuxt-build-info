import type { BuildInfo, Environment } from './runtime/types'
import { addImportsDir, createResolver, defineNuxtModule } from '@nuxt/kit'
import { getGitInfo } from './runtime/utils/env'

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
  disablePublicAssets?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'build-env',
    configKey: 'buildEnv',
  },
  defaults: {
    version: undefined,
    disablePublicAssets: false,
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = resolve('./runtime')

    nuxt.options.alias['#build-env'] = resolve('./runtime')

    // Get build info
    const { branch, commit, shortCommit } = await getGitInfo()
    const buildInfo: BuildInfo = {
      version: options.version || '0.0.0',
      commit,
      shortCommit,
      branch,
      env: process.env.NODE_ENV as Environment,
      time: new Date().toISOString(),
    }

    nuxt.options.appConfig.buildEnv = buildInfo

    addImportsDir(resolve(runtimeDir, 'composables'))
  },
})
