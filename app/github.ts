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

export async function createMajorVersionTag(majorVersionTagName: string, tagToReference: Tag, owner: string = githubContext.repo.owner, repo: string = githubContext.repo.repo, token: string = inputs.token): Promise<void>  {
  const octokit = getOctokit(token)

  await octokit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/tags/${majorVersionTagName}`,
    sha: tagToReference.commit.sha,
  })
}

export async function updateMajorVersionTag(majorVersionTagName: string, tagToReference: Tag, owner: string = githubContext.repo.owner, repo: string = githubContext.repo.repo, token: string = inputs.token): Promise<void>  {
  const octokit = getOctokit(token)

  await octokit.rest.git.updateRef({
    owner,
    repo,
    ref: `tags/${majorVersionTagName}`,
    sha: tagToReference.commit.sha,
    force: true     
  })
}
