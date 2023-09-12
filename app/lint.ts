import parser from "conventional-commits-parser"
import conventionCommitsSpec from "conventional-changelog-conventionalcommits"

export const lintPrTitle = async (title: string): Promise<boolean> => {
  if (!title) return false

  const spec = await conventionCommitsSpec()

  const parsedCommit = parser.sync(title, spec.parserOpts)

  if (!parsedCommit || !parsedCommit.type) return false

  let parsedCommitType = parsedCommit.type
  parsedCommitType = parsedCommitType.replace(/!/g, "")

  // A parsed commit might have a type "foo:" which we want to return false for. Assert the type is a valid type for the spec.
  const availableCommitTypesForSpec = conventionCommitsSpec.DEFAULT_COMMIT_TYPES.map(
    (obj: { type: string }) => obj.type
  )

  if (!availableCommitTypesForSpec.includes(parsedCommitType)) return false

  return true
}
