#!/bin/bash

set -e 

# Clean the build directory 
rm -rf dist/ 

# compile all source code into a index.js file that GitHub Actions can run 
npx ncc build app/index.ts --source-map -o dist 

# .md files are not copied into dist/ when using ncc. Copy them manually
cp -r app/assets/ dist/assets/ 

# a package that we are using has code that performs a dynamic "require" call: 
# https://github.com/semantic-release/commit-analyzer/blob/16ea0f7389468bda69fefaf124310088ec746f0a/lib/load-parser-config.js#L22 
# which will crash our code at runtime because there isn't any node_modules/ files. ncc works great for 
# modules that we have explictly imported but this will not work because it's trying to dynamically load. 
# To fix this bug, we are installing a bare minimum amount of modules needed so the module can be dynamically 
# loaded at runtime. 
# 
# Future releases of commit-analyzer might not use importFrom package: https://github.com/semantic-release/commit-analyzer/pull/297#issuecomment-996926823 
# which might fix this. 
# cd dist/ && mkdir node_modules 
# npm i conventional-changelog-conventionalcommits
# cd ..