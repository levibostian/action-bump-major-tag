import { context as githubContext, getOctokit } from "@actions/github"
import { Tag } from "./type/tag";
import { inputs } from "./input";

export async function getAllTagsForRepo(owner: string = githubContext.repo.owner, repo: string = githubContext.repo.repo, token: string = inputs.token): Promise<Tag[]> {
  const octokit = getOctokit(token)

  return octokit.paginate(octokit.rest.repos.listTags, {
    owner,
    repo,
    per_page: 100
  })
}

export async function createOrUpdateMajorVersionTag(majorVersionTagName: string, tagToReference: Tag, owner: string = githubContext.repo.owner, repo: string = githubContext.repo.repo, token: string = inputs.token): Promise<void>  {
  const octokit = getOctokit(token)

  let tryToCreate = false 
  // try to update the tag (via force), first. If it fails, we will try to create. 
  // there is no github endpoint for creating or updating. 
  try {
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `tags/${majorVersionTagName}`,
      sha: tagToReference.commit.sha,
      force: true     
    })
  } catch {
    tryToCreate = true
  }

  if (tryToCreate) { // update failed, so we will assume that the tag doesn't exist. try creating it. 
    // no try around this block because if this fails, we want to fail the action.
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/tags/${majorVersionTagName}`,
      sha: tagToReference.commit.sha,
    })
  }
}
