/* eslint-disable */

const tsPreset = require("ts-jest/jest-preset")
const customPreset = require("@levibostian/jest-config/jest-preset")

module.exports = {
  ...tsPreset,
  ...customPreset
}
