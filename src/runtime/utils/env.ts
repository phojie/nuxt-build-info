import Git from 'simple-git'
import { isDevelopment } from 'std-env'

/**
 * Environment variable `PULL_REQUEST`
 *
 * Whether triggered by a GitHub PR
 */
export const isPR = process.env.PULL_REQUEST === 'true' || process.env.VERCEL_GIT_COMMIT_REF?.startsWith('pull/') || process.env.CF_PAGES_BRANCH?.startsWith('pull/') || process.env.BRANCH?.startsWith('pull/')

/**
 * Git branch
 */
export const gitBranch = process.env.BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.CF_PAGES_BRANCH

/**
 * Whether triggered by PR, `deploy-preview` or `dev`.
 */
export const isPreview = isPR || process.env.CONTEXT === 'deploy-preview' || process.env.CONTEXT === 'dev' || process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development' || process.env.CF_PAGES_BRANCH !== 'main'

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
