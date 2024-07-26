"use server"

import { APICallError, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { OpenAIChatModelId } from "@ai-sdk/openai/internal"
import { z } from "zod"
import {
  AnswerDTO,
  AnswerErrorDTO,
  AnswerSuccessDTO,
  outOfScopeAnswer,
  Sentiment,
  AnswerZodSchema,
  sentimentValues,
} from "./dtos"

const openAIChatModelId: OpenAIChatModelId = "gpt-4o-mini"
const systemSetUpMessage = `
  You are an AI chatbot specialized in analyzing the sentiment of user reviews. 
  When a user inputs a review, your task is to determine and respond with the sentiment of the review.
  If the user input something that does not seem to be a construct service review, respond with 
  "${outOfScopeAnswer}"
  Sentiments can be classified as ${sentimentValues.join(", ")}.
  Do not perform any other tasks.

  Guidelines:
  - ${Sentiment.POSITIVE}: The review expresses satisfaction, happiness, or favorable opinions about the construction service.
  - ${Sentiment.NEGATIVE}: The review expresses dissatisfaction, unhappiness, or unfavorable opinions about the construction service.
  - ${Sentiment.NEUTRAL}: The review is balanced, neither strongly positive nor negative, or simply descriptive without clear sentiment.
  
  Examples:
    - Example 1:
      - Review: "The construction team did an excellent job! They finished ahead of schedule and the quality of work was outstanding."
      - Sentiment: ${Sentiment.POSITIVE}
    - Example 2:
      - Review: "I'm very disappointed with the service. The project was delayed multiple times and the final result was subpar."
      - Sentiment: ${Sentiment.NEGATIVE}
    - Example 3:
      - Review: "The construction service was adequate. The project was completed on time, but there were some minor issues that needed fixing."
      - Sentiment: ${Sentiment.NEUTRAL}

  Respond only with one word: either ${sentimentValues.join(", ")}. 
  If the review is ambiguous or unclear, ask the user for more details. 
  Do not perform any tasks beyond sentiment classification.
`

export async function getAnswer(prompt: string): Promise<AnswerDTO> {
  try {
    const generatedObject = await generateObject({
      model: openai(openAIChatModelId),
      system: systemSetUpMessage,
      prompt,
      schema: z.object({
        answer: AnswerZodSchema,
      }),
    })

    return generatedObject.object as AnswerSuccessDTO
  } catch (error) {
    const answerError =
      "Something went wrong, I cannot give you an answer at the moment."

    if (error instanceof APICallError) {
      // DO SOMETHING like send an alert or log the error on the dev environment
    }

    return {
      answer: answerError,
    } as AnswerErrorDTO
  }
}
