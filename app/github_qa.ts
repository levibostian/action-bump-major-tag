// I wanted to confirm the behavior of the functions in the github module. To do that, these are tests that run a real request against the github api.
import {getAllTagsForRepo, createOrUpdateMajorVersionTag} from "./github"

const githubToken = process.env.GITHUB_TOKEN as string

(async () => {
  // test get all tags 
  const repoTags = await getAllTagsForRepo("fastlane", "fastlane", githubToken) // test a repo with lots of tags. to test rate limiting and how long pagination takes. 
  console.log(repoTags)

  // create a tag 
  // manually create a tag in the repo. input the name and sha of the tag you created below. 
  // this will test if we can create a new v1 tag.   
  await createOrUpdateMajorVersionTag("v1", {name: "v1.2.4", commit: {sha: "d0539124dc5636c151ea1f6c4521b67b6a0a4a12"}}, "levibostian", "tmp-repo-test-tags", githubToken)  
  // after you test creating a tag, test updating one. 
  // manually create a tag in the repo. input the name and sha of the tag you created, then run the function above again. 
})()
