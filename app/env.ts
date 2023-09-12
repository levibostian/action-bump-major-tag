import { setFailed, ExitCode } from "@actions/core"
import { exit } from "process"

export const terminate = (failure?: string | Error): void => {
  if (failure) {
    setFailed(failure)
  } else {
    exit(ExitCode.Success)
  }
}
