import * as env from "./env"

// It's really easy to incorrectly import the @actions/core functions which
// cause a runtime crash. These tests assert the core function imports are correct.
describe("Check functions do not throw error.", () => {
  // Can't test success because call to exit() which exits the tests running
  it(`expect terminate as failure to not throw`, async () => {
    expect(() => env.terminate(new Error("foo"))).not.toThrow()
  })
})
