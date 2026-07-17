import type { BuiltSentenceParts } from "./types";

export function buildHelpSentence({ fact, boundary, help }: BuiltSentenceParts) {
  return [fact, boundary, help]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
}
