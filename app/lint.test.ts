import * as lint from "./lint"

describe("lintPrTitle", () => {
  it(`given empty string, expect false`, async () => {
    expect(await lint.lintPrTitle("")).toEqual(false)
  })
  it(`given invalid title, expect false`, async () => {
    expect(await lint.lintPrTitle("foo: bar")).toEqual(false)
  })
  it(`given valid title, expect true`, async () => {
    expect(await lint.lintPrTitle("feat: bar")).toEqual(true)
  })
  it(`given breaking change conventional title, expect true`, async () => {
    expect(await lint.lintPrTitle("feat!: bar")).toEqual(true)
  })
})
