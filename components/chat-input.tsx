"use client"

import type React from "react"
import { SendIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import type { FormEvent } from "react"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Textarea
        placeholder="Ask about the Civil Aviation Act..."
        value={input}
        onChange={handleInputChange}
        className="min-h-10 resize-none bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            if (input.trim()) {
              handleSubmit(e as unknown as FormEvent<HTMLFormElement>)
            }
          }
        }}
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="icon"
        disabled={isLoading || !input.trim()}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <SendIcon className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  )
}
