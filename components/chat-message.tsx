import type { Message } from "ai"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "./ui/card"
import ReactMarkdown from "react-markdown"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-blue-600 text-white shadow">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <Card
        className={cn(
          "max-w-[85%] px-4 py-3",
          isUser
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
        )}
      >
        {isUser ? (
          <div>{message.content}</div>
        ) : (
          <div className="prose dark:prose-invert prose-sm max-w-none break-words">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} className="text-blue-600 dark:text-blue-400 hover:underline" />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    {...props}
                    className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic text-gray-700 dark:text-gray-300"
                  />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </Card>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-gray-100 dark:bg-gray-700 shadow">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}
