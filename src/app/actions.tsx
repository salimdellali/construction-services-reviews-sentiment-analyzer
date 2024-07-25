"use server"

import { APICallError, generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { OpenAIChatModelId } from "@ai-sdk/openai/internal"

const openAIChatModelId: OpenAIChatModelId = "gpt-4o-mini"
const systemSetUpMessage = `
  You are an AI chatbot specialized in analyzing the sentiment of user reviews. 
  When a user inputs a review, your task is to determine and respond with the sentiment of the review.
  If the user input something that does not seem to be a construct service review, respond with 
  "I'm sorry, I am only capable of analyzing reviews related to construction services."
  Sentiments can be classified as Positive, Negative, or Neutral.
  Do not perform any other tasks.

  Guidelines:
  - Positive: The review expresses satisfaction, happiness, or favorable opinions about the construction service.
  - Negative: The review expresses dissatisfaction, unhappiness, or unfavorable opinions about the construction service.
  - Neutral: The review is balanced, neither strongly positive nor negative, or simply descriptive without clear sentiment.
  
  Examples:
    - Example 1:
      - Review: "The construction team did an excellent job! They finished ahead of schedule and the quality of work was outstanding."
      - Sentiment: Positive
    - Example 2:
      - Review: "I'm very disappointed with the service. The project was delayed multiple times and the final result was subpar."
      - Sentiment: Negative
    - Example 3:
      - Review: "The construction service was adequate. The project was completed on time, but there were some minor issues that needed fixing."
      - Sentiment: Neutral

  Respond only with one word: either "Positive", "Negative", or "Neutral". 
  If the review is ambiguous or unclear, ask the user for more details. 
  Do not perform any tasks beyond sentiment classification.
`

export async function getAnswer(prompt: string): Promise<AnswerDTO> {
  let answer: string

  try {
    const generateTextResult = await generateText({
      model: openai(openAIChatModelId),
      system: systemSetUpMessage,
      prompt,
    })

    answer = generateTextResult.text
  } catch (error) {
    answer = "Something went wrong, I cannot give you an answer at the moment."

    if (error instanceof APICallError) {
      // DO SOMETHING like send an alert or log the error on the dev environment
    }
  }

  return {
    text: answer,
  }
}
