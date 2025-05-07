import type { Environment } from '../types'
import Git from 'simple-git'
import { isDevelopment } from 'std-env'

// vercel, cloudflare pages
export const isPR = process.env.NUXT_ENV_VERCEL_GIT_COMMIT_REF?.startsWith('pull/') || process.env.PULL_REQUEST === 'true' || process.env.CF_PAGES_BRANCH?.startsWith('pull/')

export const gitBranch = process.env.VERCEL_GIT_COMMIT_REF || process.env.CF_PAGES_BRANCH || process.env.BRANCH

export const isPreview = isPR || process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development' || process.env.CONTEXT === 'deploy-preview' || process.env.CONTEXT === 'dev' || process.env.CF_PAGES_BRANCH !== 'main'

const git = Git()
export async function getGitInfo(): Promise<{ branch: string, commit: string, shortCommit: string }> {
  let branch: string
  try {
    branch = gitBranch || await git.revparse(['--abbrev-ref', 'HEAD'])
  }
  catch {
    branch = 'unknown'
  }

  let commit
  try {
    commit = await git.revparse(['HEAD'])
  }
  catch {
    commit = 'unknown'
  }

  let shortCommit
  try {
    shortCommit = await git.revparse(['--short=7', 'HEAD'])
  }
  catch {
    shortCommit = 'unknown'
  }

  return { branch, commit, shortCommit }
}

export async function getEnv(): Promise<{
  env: Environment
  commit: string
  shortCommit: string
  branch: string
}> {
  const { commit, shortCommit, branch } = await getGitInfo()
  const env = isDevelopment
    ? 'dev'
    : isPreview
      ? 'preview'
      : branch === 'main'
        ? 'canary'
        : 'release'
  return { commit, shortCommit, branch, env } as const
}
