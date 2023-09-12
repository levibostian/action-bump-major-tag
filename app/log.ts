import * as core from "@actions/core"

export const debug = (message: string): void => {
  core.debug(message)
}

export const warning = (message: string): void => {
  core.warning(message)
}

export const info = (message: string): void => {
  core.info(message)
}

export const error = (message: string | Error): void => {
  core.error(message)
}
