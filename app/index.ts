import { inputs } from "./input"
import { context as githubContext, getOctokit } from "@actions/github"
import * as log from "./log"
import { filterValidTags, mapLatestVersionWithMajorVersion } from "./tags"

;import { Tag } from "./type/tag";
(async () => {  
  const octokit = getOctokit(inputs.token)

  // using octokit, get all of the git tags created in the repository
  let repoTags: Tag[] = await octokit.paginate(octokit.rest.repos.listTags, {
    owner: githubContext.repo.owner,
    repo: githubContext.repo.repo
  })
  
  repoTags = filterValidTags(repoTags)

  // finds the latest semantic version for each major version. this determines that tag that should be pointed to for each major version tag. 
  const latestVersionWithMajorVersion = mapLatestVersionWithMajorVersion(repoTags, inputs.tagPrefix)

  for (const [latestVersion, majorVersion] of latestVersionWithMajorVersion) {    
    log.info(`Creating or updating major version tag: ${majorVersion}, pointing to existing tag: ${latestVersion}`)

    await octokit.rest.git.createRef({
      owner: githubContext.repo.owner,
      repo: githubContext.repo.repo,
      ref: `refs/tags/${majorVersion}`,
      sha: latestVersion.commit.sha
    })
  }
})()

