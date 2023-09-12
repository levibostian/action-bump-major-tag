import { Input } from "./type/input"
import * as core from "@actions/core"

export const inputs: Input = {
  token: core.getInput("token")
}
