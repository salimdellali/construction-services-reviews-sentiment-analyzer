"use client"

import { Input } from "../components/ui/input"
import { useEffect, useRef, useState } from "react"
import { type CoreMessage } from "ai"
import { getAnswer } from "./actions"
import { Separator } from "../components/ui/separator"
import { Skeleton } from "../components/ui/skeleton"
import { AnswerDTO } from "./dtos"

enum Role {
  USER = "user",
  ASSISTANT = "assistant",
}

// Allow streaming responses up to 30s
export const maxDuration = 30

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([])
  const [input, setInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  // enable auto bottom scroll
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // focus back on input when it is not disabled anymore
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus()
    }
  }, [isLoading])

  async function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
    // 1. prevent default form submission behavior
    e.preventDefault()

    // 2. update the messages state by appending the new user's input message to the current list of messages
    const newMessages: CoreMessage[] = [
      ...messages,
      {
        role: Role.USER,
        content: input,
      },
    ]
    setMessages(newMessages)

    // 3. clear user input
    setInput("")

    // 4. set loading state
    setIsLoading(true)

    // 5. call the getAnswer backend action and get the assistant's response
    const { answer }: AnswerDTO = await getAnswer(input)

    // 6 clear loading state
    setIsLoading(false)

    // 7. update the messages state with the received assistant's response
    setMessages([...newMessages, { role: Role.ASSISTANT, content: answer }])
  }

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {/* render the header */}
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4">
        Construction Services Reviews Sentiment Analyzer
      </h4>

      <p className="text-sm text-muted-foreground">
        Write down or copy/paste a review related to a construction service, the
        AI assistant shall analyze the sentiment of the review.
      </p>

      <Separator className="my-4" />

      {/* render the messages */}
      {messages.map((m, i) => (
        <div
          key={i}
          className={`whitespace-pre-wrap break-words ${
            // add a small margin after each AI's response
            m.role === Role.ASSISTANT && "mb-4"
          }`}
        >
          {m.role === Role.USER ? "🧑 User: " : "🤖 AI: "}
          {m.content as string}
        </div>
      ))}

      {/* render the loading indicator */}
      {isLoading && (
        <div className="space-y-2">
          🤖 AI is thinking...
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      )}

      {/* render the input */}
      <div ref={messagesEndRef}>
        <form onSubmit={handleSendMessage}>
          <Input
            ref={inputRef}
            className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-500 rounded shadow-xl"
            value={input}
            placeholder="Write your review, then press Enter to send..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  )
}
