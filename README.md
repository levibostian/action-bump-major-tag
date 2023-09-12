![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/levibostian/action-conventional-pr-linter?label=latest%20stable%20release)
![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/levibostian/action-conventional-pr-linter?include_prereleases&label=latest%20pre-release%20version)

# action-bump-major-tag

GitHub Action that updates a major version tag (v1, v2, etc) from the latest git tags made. There are similar tools that already exist, but all require they are executed after a new git tag is made. This action is designed to run anytime you wish by querying the GitHub repository for already created tags and updates from that. 

# Getting started

Run this whenever you want. Manually or automatically. 

```yaml
name: Update major version tags 

on:
  workflow_dispatch: # allow running manually, if you want to. 
  push: 
    branches: [main] # Or, run when you run an automated deployment 

jobs:
  deploy-to-production:
    # Imagine that this is code that pushes to production. Including creating a new git tag. 
  update-major-version:
    needs: deploy-to-production # Run after pushing code to production. 
    runs-on: ubuntu-latest 
    permissions: 
      contents: write # to create git tags 
    steps: 
    - uses: levibostian/action-bump-major-tag@v1
```

# Configure 

```yml
- uses: levibostian/action-bump-major-tag@v1
  with:
    tag-prefix: "v" # (optional) Prefix to add to each major version created/updated. Example: 'v' will create tags like 'v1', 'v2', etc.
```

# Development

- `npm install`
- `npm run test` to run automated tests
