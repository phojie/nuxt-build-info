import Git from 'simple-git'
import { isDevelopment } from 'std-env'

// vercel, cloudflare pages
export const isPR = import.meta.env.NUXT_ENV_VERCEL_GIT_COMMIT_REF?.startsWith('pull/') || import.meta.env.PULL_REQUEST === 'true' || import.meta.env.CF_PAGES_BRANCH?.startsWith('pull/')

export const gitBranch = import.meta.env.VERCEL_GIT_COMMIT_REF || import.meta.env.CF_PAGES_BRANCH || import.meta.env.BRANCH

export const isPreview = isPR || import.meta.env.VERCEL_ENV === 'preview' || import.meta.env.VERCEL_ENV === 'development' || import.meta.env.CONTEXT === 'deploy-preview' || import.meta.env.CONTEXT === 'dev' || import.meta.env.CF_PAGES_BRANCH !== 'main'

const git = Git()
export async function getGitInfo() {
  let branch
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

export async function getEnv() {
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
