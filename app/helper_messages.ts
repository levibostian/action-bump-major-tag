import { readFileSync } from "fs"
import path from "path"
import stringFormat from "string-format"

const getMessage = (
  args: object,
  relativeFilePath: string,
  footerArgs: FooterArgs = { includedFooterDropdownOpened: "" }
): string => {
  const fileString = stringFormat(
    readFileSync(path.join(__dirname, relativeFilePath), { encoding: "utf-8" }),
    args
  )
  const footerString = stringFormat(
    readFileSync(path.join(__dirname, "assets/footer.md"), { encoding: "utf-8" }),
    footerArgs
  )
  const combinedStrings = fileString + "\n\n" + footerString

  return stringFormat(combinedStrings, args)
}

interface FooterArgs {
  // If the footer markdown content should be expanded by default or not.
  includedFooterDropdownOpened: "open" | ""
}

export interface InvalidPrTitleTemplateArgs {
  author: string
}

export const getInvalidPrTitleHelp = (
  args: InvalidPrTitleTemplateArgs,
  options?: { filePath?: string }
): string => {
  const filePath = options?.filePath || "assets/invalid_pr_title_help.md"

  return getMessage(args, filePath, {
    includedFooterDropdownOpened: "open"
  })
}
