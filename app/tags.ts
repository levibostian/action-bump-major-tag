import * as semver from 'semver'
import { Tag } from './type/tag'

export function filterValidTags(tags: Tag[]): Tag[] {  
  return tags
  .filter(tag => {
    let isValidSemanticVersion = semver.clean(tag.name) !== null && semver.valid(tag.name) !== null
    let isPrerelease = semver.prerelease(tag.name) !== null

    return isValidSemanticVersion && !isPrerelease
  })
  .map(tag => {
    return {
      name: semver.clean(tag.name)!,
      commit: tag.commit
    }
  })
}

export function mapLatestVersionWithMajorVersion(tags: Tag[], prefix: string): Map<Tag, string> {
  // map all of the tags to an object with the tag and the major version tag.
  let tagsToMajorVersion: Map<number, Tag[]> = new Map()

  for (const tag of tags) {
    const majorVersion = semver.major(tag.name)  

    if (!tagsToMajorVersion.has(majorVersion)) {
      tagsToMajorVersion.set(majorVersion, [])
    }

    tagsToMajorVersion.get(majorVersion)!.push(tag)
  }

  let returnResult: Map<Tag, string> = new Map()

  tagsToMajorVersion.forEach((tags, majorVersion) => {
    let majorVersionWithPrefix = `${prefix}${majorVersion}`
    let latestVersion = tags.sort((a, b) => semver.rcompare(a.name, b.name))[0]

    returnResult.set(latestVersion, majorVersionWithPrefix)
  })

  return returnResult
}

