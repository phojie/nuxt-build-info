export type Environment = 'dev' | 'preview' | 'canary' | 'release'

export interface BuildInfo {
  version: string
  time: number
  commit: string
  shortCommit: string
  branch: string
  env: Environment
}
