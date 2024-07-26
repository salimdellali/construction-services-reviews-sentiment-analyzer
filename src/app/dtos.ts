import { z } from "zod"

// Define the out-of-scope answer
export const outOfScopeAnswer =
  "I'm sorry, I am only capable of analyzing reviews related to construction services."

// Define the Sentiment enum, add more or remove as needed
export enum Sentiment {
  POSITIVE = "Positive",
  NEGATIVE = "Negative",
  NEUTRAL = "Neutral",
}

// Extract the values from the Sentiment enum
export const sentimentValues = Object.values(Sentiment) as [string, ...string[]]

// Create the SentimentSchema using the extracted enum values and the out-of-scope answer
export const AnswerZodSchema = z.enum([
  ...sentimentValues,
  outOfScopeAnswer,
] as [string, ...string[]])

/**
 * Centralize the Data Transfer Objects (DTOs) schemas
 * to ensure the type safety of the data transferred
 * between the frontend and the backend
 */
export type AnswerSuccessDTO = {
  answer: z.infer<typeof AnswerZodSchema>
}

export type AnswerErrorDTO = {
  answer: string
}

export type AnswerDTO = AnswerSuccessDTO | AnswerErrorDTO
