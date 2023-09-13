import { context } from "@actions/github";
import { createMajorVersionTag, updateMajorVersionTag, getAllTagsForRepo } from "./github";
import { inputs } from "./input"
import * as log from "./log"
import { filterValidTags, mapLatestVersionWithMajorVersion } from "./tags"
import { getRepo } from "./env";

export async function run() {
  log.info(`Hello! 👋 I will make sure that all of the major version tags (example: v1, v2...) are up-to-date.`)

  let repoInfo = getRepo()
  log.info(`🔎 Getting all tags from repository, github.com/${repoInfo.owner}/${repoInfo.repo}...`)
  let repoTags = await getAllTagsForRepo()

  log.info(`Sorting tags to find latest tag for each major version...`)
  repoTags = filterValidTags(repoTags)
  // Example: Map { 'v1.0.0' => 'v1', '3.4.2', => '3' }
  const latestVersionWithMajorVersion = mapLatestVersionWithMajorVersion(repoTags, inputs.tagPrefix)
  log.info(`✅ Determined these are the latest tags for each major version: `)
  latestVersionWithMajorVersion.forEach((majorVersion, latestVersion) => {
    log.info(` - ${latestVersion.name} => ${majorVersion}`)
  })

  for (const [latestVersion, majorVersion] of latestVersionWithMajorVersion) {    
    let needToCreateTag = false 

    try {
      log.info(`Updating major version tag ${majorVersion} to point to latest tag ${latestVersion.name}...`)
      await updateMajorVersionTag(majorVersion, latestVersion)
      log.info(`Success!`)
    } catch (error) {
      needToCreateTag = true      
    }    

    if (needToCreateTag) {
      log.info(`Updating major version tag ${majorVersion} failed. We assume it's because the tag ${majorVersion} does not yet exist. Creating tag ${majorVersion}...`)
      await createMajorVersionTag(majorVersion, latestVersion)
      log.info(`Success!`)
    }
  }

  log.info(`🚀 All major version tags are now up-to-date!`)
}

