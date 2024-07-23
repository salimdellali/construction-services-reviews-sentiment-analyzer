"use client"

import { useChat } from "ai/react"
import { Input } from "../components/ui/input"
import { useEffect, useRef } from "react"
import { Separator } from "../components/ui/separator"

enum Role {
  USER = "user",
  ASSISTANT = "assistant",
}

export default function Chat() {
  // use the useChat hook
  const { messages, input, handleInputChange, handleSubmit } = useChat()

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
      {messages.map((m) => (
        <div
          key={m.id}
          className={`whitespace-pre-wrap break-words ${
            m.role === Role.ASSISTANT && "mb-4"
          }`}
        >
          {m.role === Role.USER ? "🧑 User: " : "🤖 AI: "}
          {m.content}
        </div>
      ))}

      {/* render the input */}
      <div ref={messagesEndRef}>
        <form onSubmit={handleSubmit}>
          <Input
            className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-500 rounded shadow-xl"
            value={input}
            placeholder="Write your review..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  )
}
