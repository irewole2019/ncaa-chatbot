"use client"

import Image from "next/image"
import { Book, MessagesSquare } from "lucide-react"

const exampleQuestions = [
  "What is the purpose of the Civil Aviation Act?",
  "What are the powers of the Nigerian Civil Aviation Authority?",
  "How are air operator certificates issued?",
  "What are the safety regulations for aircraft operations?",
]

interface EmptyStateProps {
  setActiveTab?: (tab: string) => void
}

export function EmptyState({ setActiveTab }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8">
      <div className="relative w-20 h-20 mb-4">
        <Image src="/ncaa-logo.png" alt="NCAA Logo" fill className="object-contain" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Civil Aviation Act Assistant</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        Ask questions about the Civil Aviation Act of Nigeria (2022) and get accurate answers with section references.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
        {exampleQuestions.map((question) => (
          <button
            key={question}
            className="flex items-start gap-2 rounded-md border p-3 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              const input = document.querySelector("textarea")
              if (input) {
                const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                  window.HTMLTextAreaElement.prototype,
                  "value",
                )?.set
                if (nativeTextAreaValueSetter) {
                  nativeTextAreaValueSetter.call(input, question)
                  input.dispatchEvent(new Event("input", { bubbles: true }))
                  input.focus()
                }
              }
            }}
          >
            <MessagesSquare className="h-4 w-4 mt-0.5 text-blue-600" />
            <span>{question}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => setActiveTab?.("about")}
        className="mt-8 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        <Book className="h-4 w-4" />
        <span>Learn more about this chatbot</span>
      </button>
    </div>
  )
}
