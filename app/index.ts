import { inputs } from "./input"
import { lintPrTitle } from "./lint"
import { context as githubContext, getOctokit } from "@actions/github"
import { terminate } from "./env"
import * as log from "./log"
import * as cathy from "cathy"
import { getInvalidPrTitleHelp } from "./helper_messages"
;(async () => {
  log.debug("Checking if action was triggered by a PR")

  if (githubContext.eventName != "pull_request") {
    log.info(
      "GitHub Action workflow trigger is not a pull_request. Nothing for me to do. I'll just exit."
    )
    return terminate()
  }

  log.debug("Getting input and context from action")
  const prNumber = githubContext.payload.pull_request?.number
  if (!prNumber) {
    log.info(
      "GitHub Action must not have triggered by a pull_request because I cannot find a pull request number. Nothing for me to do. I'll just exit."
    )
    return terminate()
  }
  log.debug(`Action running against PR ${prNumber}`)

  const octokit = getOctokit(inputs.token)

  const pullRequest = await octokit.rest.pulls.get({
    owner: githubContext.repo.owner,
    repo: githubContext.repo.repo,
    pull_number: prNumber
  })

  log.debug(`GitHub pull request: ${JSON.stringify(pullRequest.data)}`)
  const prTitle = pullRequest.data.title
  const prAuthor = pullRequest.data.user?.login || ""

  const isTitleValid = await lintPrTitle(prTitle)
  if (!isTitleValid) {
    await cathy.speak(
      getInvalidPrTitleHelp({
        author: prAuthor
      }),
      {
        githubToken: inputs.token,
        githubRepo: `${githubContext.repo.owner}/${githubContext.repo.repo}`,
        githubIssue: prNumber,
        updateExisting: true,
        updateID: "action-semantic-pr_help-pr-title"
      }
    )

    return terminate(new Error(`Pull request title, ${prTitle}, is not valid.`))
  }

  log.info(`Looks like the PR title, ${prTitle}, is valid!`)
})()
