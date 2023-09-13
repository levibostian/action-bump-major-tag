import { context } from "@actions/github";

export function getRepo(): {owner: string, repo: string} {
  return {
    owner: context.repo.owner,
    repo: context.repo.repo
  }
}