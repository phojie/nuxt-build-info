import type { BuildInfo } from '../types'
import { useAppConfig } from '#app'

export function useBuildEnv(): BuildInfo {
  const appConfig = useAppConfig()
  return appConfig.buildEnv
}
