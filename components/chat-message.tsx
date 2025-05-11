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
                // Improve heading styles
                h1: ({ node, ...props }) => <h1 {...props} className="text-2xl font-bold mt-6 mb-4" />,
                h2: ({ node, ...props }) => <h2 {...props} className="text-xl font-bold mt-5 mb-3" />,
                h3: ({ node, ...props }) => <h3 {...props} className="text-lg font-semibold mt-4 mb-2" />,
                // Improve paragraph spacing
                p: ({ node, ...props }) => <p {...props} className="my-3" />,
                // Improve list formatting
                ol: ({ node, ...props }) => <ol {...props} className="pl-6 my-3 list-decimal" />,
                ul: ({ node, ...props }) => <ul {...props} className="pl-6 my-3 list-disc" />,
                li: ({ node, ...props }) => <li {...props} className="my-1" />,
                // Improve blockquote styling
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    {...props}
                    className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-1 my-3 italic text-gray-700 dark:text-gray-300"
                  />
                ),
                // Improve link styling
                a: ({ node, ...props }) => (
                  <a {...props} className="text-blue-600 dark:text-blue-400 hover:underline" />
                ),
                // Add proper spacing for horizontal rules
                hr: ({ node, ...props }) => <hr {...props} className="my-4 border-gray-300 dark:border-gray-700" />,
                // Improve code block styling
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code {...props} className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm" />
                  ) : (
                    <code
                      {...props}
                      className="block bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm overflow-x-auto my-3"
                    />
                  ),
                // Improve strong/bold text
                strong: ({ node, ...props }) => <strong {...props} className="font-bold" />,
                // Improve emphasis/italic text
                em: ({ node, ...props }) => <em {...props} className="italic" />,
              }}
              remarkPlugins={[]}
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
