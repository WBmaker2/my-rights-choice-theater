export type RightId =
  | "self-respect"
  | "participation"
  | "privacy"
  | "protection"
  | "safe-play";

export type SafeActionId =
  | "say-boundary"
  | "move-away"
  | "show-help-card"
  | "ask-adult"
  | "ask-another-adult"
  | "skip-scene";

export type CommunicationMode = "speak" | "show-card" | "point";

export interface RightCard {
  id: RightId;
  icon: string;
  label: string;
  description: string;
}

export interface SafeAction {
  id: SafeActionId;
  icon: string;
  label: string;
  description: string;
}

export interface ScenePanel {
  id: string;
  icon: string;
  place: string;
  narration: string;
  dialogue?: string;
  altText: string;
}

export interface AdultResponse {
  message: string;
  responsibilities: [string, string, string, string];
}

export interface Scene {
  id: string;
  title: string;
  eyebrow: string;
  fictionalNotice: string;
  imageSrc: string;
  panels: ScenePanel[];
  rightIds: RightId[];
  rightOptions: RightId[];
  actionOptions: SafeActionId[];
  factPhrases: string[];
  boundaryPhrases: string[];
  helpPhrases: string[];
  adultResponse: AdultResponse;
  anotherAdult: string;
  sensitivityTier: 1 | 2;
  sourceIds: string[];
  reviewVersion: string;
  reviewStatus: "review-ready";
  reviewedAt: string;
}

export interface BuiltSentenceParts {
  fact: string;
  boundary?: string;
  help: string;
}
