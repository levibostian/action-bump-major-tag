import * as log from "./log"

// It's really easy to incorrectly import the @actions/core functions which
// cause a runtime crash. These tests assert the core function imports are correct.
describe("Check log functions do not throw error.", () => {
  it(`debug`, async () => {
    expect(() => log.debug("foo")).not.toThrow()
  })
  it(`warning`, async () => {
    expect(() => log.warning("foo")).not.toThrow()
  })
  it(`info`, async () => {
    expect(() => log.info("foo")).not.toThrow()
  })
  it(`error`, async () => {
    expect(() => log.error("foo")).not.toThrow()
  })
})
