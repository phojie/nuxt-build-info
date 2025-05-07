import type { BuildInfo } from '../types'
import { useAppConfig } from '#app'

export function useBuildInfo(): BuildInfo {
  const appConfig = useAppConfig()
  return appConfig.buildInfo
}
