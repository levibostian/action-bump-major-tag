import * as log from './log'
import { run } from './plugin'
import * as github from "./github"
import * as env from './env'

describe('plugin logs', () => {
  it('should generate expected logs', async() => {
    const logMock = jest.spyOn(log, 'info')
    jest.spyOn(env, 'getRepo').mockReturnValueOnce({owner: "levibostian", repo: "action-bump-major-version"})
    jest.spyOn(github, 'getAllTagsForRepo').mockResolvedValueOnce([{name: "v1.0.0", commit: {sha: "123"}}])
    jest.spyOn(github, 'updateMajorVersionTag').mockReturnValueOnce(Promise.reject())
    jest.spyOn(github, 'createMajorVersionTag').mockReturnValueOnce(Promise.resolve())        

    await run()

    let generatedLogs = logMock.mock.calls.flatMap((call) => call[0])

    expect(generatedLogs).toMatchInlineSnapshot(`
[
  "Hello! 👋 I will make sure that all of the major version tags (example: v1, v2...) are up-to-date.",
  "🔎 Getting all tags from repository, github.com/levibostian/action-bump-major-version...",
  "Sorting tags to find latest tag for each major version...",
  "✅ Determined these are the latest tags for each major version: ",
  " - 1.0.0 => 1",
  "Updating major version tag 1 to point to latest tag 1.0.0...",
  "Updating major version tag 1 failed. We assume it's because the tag 1 does not yet exist. Creating tag 1...",
  "Success!",
  "🚀 All major version tags are now up-to-date!",
]
`)
  })
})