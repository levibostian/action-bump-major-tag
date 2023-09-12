![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/levibostian/action-conventional-pr-linter?label=latest%20stable%20release)
![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/levibostian/action-conventional-pr-linter?include_prereleases&label=latest%20pre-release%20version)

# action-conventional-pr-linter

GitHub Action that lints pull request titles to assert it conforms to a [conventional commit](https://github.com/conventional-changelog/conventional-changelog) spec.

Great Action if you use tools such as [semantic-release](https://github.com/semantic-release/semantic-release). Merge all your PRs with confidence that the PR title is valid.

# Features

- Lint pull request titles to see if they match a conventional commit spec.
- If pull request title not valid, print a human readable message to PR author helping them to fix the title themselves.

_Note:_ At this time, this project only supports the [conventional-commits](https://www.conventionalcommits.org/) spec. If your project uses something else (Angular, Atom, etc) then this Action will not work for you. See [feature request](https://github.com/levibostian/action-semantic-pr/issues/8) to see how you can contribute to this project!

# Getting started

You have 2 options: 

### 1. Use reusable workflow if all you need is to lint the pull request titles

```yaml
name: PR linter

on:
  pull_request:
    types: [opened, reopened, edited, synchronize, labeled]

jobs:
  lint-pr-title:
    uses: levibostian/action-conventional-pr-linter/.github/workflows/sharable-workflow.yml@v4
    permissions:
      pull-requests: write # github requires write permission when adding comments to an issue or pull request 
```

### 2. Use Action 

- Create your workflow

```yml
name: PR bot

on:
  pull_request:
    types: [opened, reopened, edited, synchronize, labeled]

jobs:
  pr-help:
    name: PR bot
    runs-on: ubuntu-latest
    permissions:
      pull-request: write # github requires write permission when adding comments to an issue or pull request 
    steps:
      - name: Lint PR title 
        uses: levibostian/action-conventional-pr-linter@v4
```

- Create pull requests! The bot will run and comment on your pull requests if the PR title is not valid.

# Development

- `npm install`
- `npm run test` to run automated tests

At this time, the Action does not have a lot of automated tests written. Instead, the Action is tested by running the Action on pull requests on this repository. Therefore, modify `.github/workflows/test-action.yml` to make sure that it will run successfully to test the Action on this repository.

# Deployment

Appropriately, this project is deployed using [semantic-release](https://github.com/semantic-release/semantic-release) and the PR titles use the [conventional commit format](https://www.conventionalcommits.org/).
