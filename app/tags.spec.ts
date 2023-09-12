import { filterValidTags, mapLatestVersionWithMajorVersion } from "./tags"
import { Tag } from "./type/tag"

describe('filterValidTags', () => {
  it('should return an empty array if no tags are passed in', () => {
    expect(filterValidTags([])).toEqual([])
  })

  it('should filter pre-release tags', () => {
    expect(filterValidTags(convertToTags("1.2.3-alpha", "1.2.3-beta.1"))).toEqual([])
  })

  it('should filter non-semantic version tags', () => {
    expect(filterValidTags(convertToTags("1.2", "1.2.3", "1", "bar.bar.bar"))).toEqual(convertToTags("1.2.3"))
  })

  it('should work with tags with a prefix', () => {
    expect(filterValidTags(convertToTags("v1.2.3"))).toEqual(convertToTags("1.2.3"))
  })  
})

describe('mapLatestVersionWithMajorVersion', () => {
  it('should return an empty array if no tags are passed in', () => {
    expect(mapLatestVersionWithMajorVersion([], "")).toEqual(new Map())
  })
  it('should return latest version when given multiple options', () => {
    expect(mapLatestVersionWithMajorVersion(convertToTags("1.2.3", "1.2.4", "1.2.5"), "")).toEqual(new Map([[toTag("1.2.5"), "1"]]))
  })

  it('should return latest version when given multiple majors', () => {
    expect(mapLatestVersionWithMajorVersion(convertToTags("1.2.3", "4.3.2", "1.2.4", "4.1.1"), "")).toEqual(new Map([[toTag("1.2.4"), "1"], [toTag("4.3.2"), "4"]]))
  })

  it('should add prefix when given', () => {
    expect(mapLatestVersionWithMajorVersion(convertToTags("1.2.3", "1.2.4", "1.2.5"), "v")).toEqual(new Map([[toTag("1.2.5"), "v1"]]))
    expect(mapLatestVersionWithMajorVersion(convertToTags("1.2.3", "1.2.4", "1.2.5"), "")).toEqual(new Map([[toTag("1.2.5"), "1"]]))
  })
})

function toTag(name: string): Tag {
  return {
    name: name,
    commit: {
      sha: "abc123"
    }
  }
}

function convertToTags(...names: string[]): Tag[] {
  return names.map(n => toTag(n))
}