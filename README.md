# action-bump-major-tag

Yet another GitHub Action that updates all of your project's major version tags (v1, v2, etc). 

# What makes this action different? 

This action has the following goals in mind: 

* **Use on a new project, or an existing project.** - This action will search through all git tags ever created on the repository and create/update all major version tags. That means that if you have an existing project that has missing or out-of-date major version tags, this is the action for you. 

* **Run action at any point in your deployment workflow.** - Unlike other similar GitHub Actions, this action does not have a requirement for *when* you run the action in your deployment process. You can run this action after creating a new git tag, after merging code into `main`, via cron, etc. Run the action when you believe it's most appropriate for your project. 

# Getting started

Run this whenever you want. Manually or automatically. 

```yaml
# The trigger for when the action runs is up to you. There are no requirements for *when* you run this action. 
# Use this document to decide what event makes most sense for you. Below we also include some examples. 
# https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#available-events
on:
  # You can run this action manually via the GitHub website 
  workflow_dispatch:

  # You can run this action when you merge commits into main branch. 
  push: 
    branches: [main] 
    tags: # Or, when a new git tag is pushed 

  # You can run this action after a new GitHub Release is made. 
  release: 
    types: [published]

  # You can run this action on a schedule such as once a day. 
  schedule:
    - cron:  '30 5,17 * * *'  

jobs:
  update-major-version:
    runs-on: ubuntu-latest     

    steps: 
    - uses: levibostian/action-bump-major-tag@v1
```

* Next, see section [permissions required by action](#permissions-required-by-action) to setup permissions for this action. 

* Lastly, see section [configure](#configure-the-action) to optionally configure the action to your liking. 

# Permissions required by action 

This action uses the GitHub API in order to complete tasks such as fetching the list of git tags created already and pushing git tags. In order for this action to do these tasks, it needs permission to do so. This section tries to explain the different methods that you can setup permissions for your project. 

# Configure the action 

```yml
- uses: levibostian/action-bump-major-tag@v1
  with:
    # (optional) Prefix to add to each major version created/updated. 
    # Example: 'v' will create tags like 'v1', 'v2', etc.
    # Default: ""
    tag-prefix: "v" 
    # (optional) GitHub access token with permission to create or update git tags on the repository. 
    # Default: "github.token" to use GitHub Actions workflow permissions. 
    # See section "Permissions required by action" to learn more about how to setup permission for your project. 
    token: ${{ secrets.UPDATE_MAJOR_VERSION_TAGS_TOKEN }} 
```

# (recommended if you do not use this action for a lot of repositories) Generate a GitHub personal access token. 

1. [Create a new personal access token in your GitHub account](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with following permissions: 
* `repo` if your GitHub repository is a private repository. 
* `workflows` required by GitHub to prevent errors when pushing git tags. GitHub requires that if a `.github/workflows/` file is created or modified by a git tag, then `workflows` permission is required to allow this action to create a major version tag. 

2. [Create a new secret](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository) in the github repository. For an example, let's say that you created a new secret named `MAJOR_VERSION_TAGS_TOKEN` with the token value. 
3. Provide this secret to the action:
```yml
jobs:
  update-major-version:
    runs-on: ubuntu-latest 
    steps: 
    - uses: levibostian/action-bump-major-tag@v1
      with:
        token: ${{ secrets.MAJOR_VERSION_TAGS_TOKEN }}
```

# (recommended if you use this action for a lot of repositories) Create a private GitHub App that generates tokens on each workflow run

* [Follow these instructions](https://github.com/peter-evans/create-pull-request/blob/main/docs/concepts-guidelines.md#authenticating-with-github-app-generated-tokens) to create a new private GitHub App that will generate new tokens with required permissions. 

Your workflow may look similar to this: 

```yml
jobs:
  major-version-bump: # update major version tags (ex: v1, v2, v3, etc.)
    runs-on: ubuntu-latest
    steps:
      - uses: tibdex/github-app-token@v1
        id: generate-token
        with:
          app_id: ${{ secrets.GENERATE_TOKEN_APP_ID }}
          private_key: ${{ secrets.GENERATE_TOKEN_PRIVATE_KEY_B64 }}

      - uses: levibostian/action-bump-major-tag@v1
        with:
          token: ${{ steps.generate-token.outputs.token }}
```

# How action works 

Each time that this action runs, it will...
1. Fetch *all* of the git tags created. 
2. Filter all git tags to remove non-semantic version tags (`major.minor.patch` such as `2.5.3`). 
3. Filter pre-release tags as it's assumed you only want stable versions of your software to be included in a major version tag. 
4. Determine the latest semantic version for each major version. Example: `1.1.1` is newer then `1.1.0` and so, use `1.1.1` as the commit in `v1` major version tag. 
5. Create or update major version tags for all major versions of your project. Feel confident that once this action runs, all major version tags are up-to-date, no matter how old the project is. 

# Development

- `nvm use`
- `npm install`
- `npm run test` to run automated tests
