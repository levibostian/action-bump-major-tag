import { createOrUpdateMajorVersionTag, getAllTagsForRepo } from "./github";
import { inputs } from "./input"
import * as log from "./log"
import { filterValidTags, mapLatestVersionWithMajorVersion } from "./tags"

(async () => {  
  let repoTags = await getAllTagsForRepo()

  repoTags = filterValidTags(repoTags)
  // Example: Map { 'v1.0.0' => 'v1', '3.4.2', => '3' }
  const latestVersionWithMajorVersion = mapLatestVersionWithMajorVersion(repoTags, inputs.tagPrefix)

  for (const [latestVersion, majorVersion] of latestVersionWithMajorVersion) {    
    log.info(`Creating or updating major version tag: ${majorVersion}, pointing to existing tag: ${latestVersion}`)

    await createOrUpdateMajorVersionTag(majorVersion, latestVersion)
  }
})()