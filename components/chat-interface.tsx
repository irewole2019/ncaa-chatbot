"use client"

import { useChat } from "ai/react"
import { useEffect, useRef, useState } from "react"
import { ChatInput } from "./chat-input"
import { ChatMessage } from "./chat-message"
import { EmptyState } from "./empty-state"
import { Card, CardContent } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("chat")

  // Improved smooth scrolling with a slight delay to ensure content is rendered
  useEffect(() => {
    if (messagesEndRef.current && activeTab === "chat") {
      const timeoutId = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [messages, activeTab])

  return (
    <Card className="w-full h-[calc(100vh-16rem)] shadow-md">
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b px-4">
          <TabsList className="mt-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
        </div>

        {/* Container with fixed height that will hold both tab contents */}
        <div className="h-[calc(100vh-19rem)] relative">
          {/* Chat tab content */}
          <TabsContent value="chat" className="absolute inset-0 flex flex-col h-full m-0 p-0">
            <CardContent className="flex-1 overflow-y-auto p-4 scroll-smooth">
              {messages.length > 0 ? (
                <div className="space-y-4 pb-2">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                  {isLoading && (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md">
                      <p>Error: {error.message || "Something went wrong. Please try again."}</p>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState setActiveTab={setActiveTab} />
              )}
            </CardContent>
            <div className="border-t p-4 bg-white dark:bg-gray-800">
              <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>

          {/* About tab content */}
          <TabsContent value="about" className="absolute inset-0 h-full m-0 p-0 overflow-y-auto">
            <div className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <h2>About the NCAA Civil Aviation Act Chatbot</h2>
                <p>
                  This chatbot provides information about the Civil Aviation Act of Nigeria (2022). It uses AI to answer
                  your questions based on the content of the Act, providing accurate section references and direct
                  quotes when appropriate.
                </p>
                <h3>How to use</h3>
                <p>
                  Simply type your question about the Civil Aviation Act in the chat input. The AI will respond with:
                </p>
                <ul>
                  <li>Direct quotes from the Act (formatted as blockquotes)</li>
                  <li>Exact section references</li>
                  <li>Plain-English explanations</li>
                </ul>
                <div className="flex items-center justify-center my-8">
                  <div className="relative w-24 h-24">
                    <Image src="/ncaa-logo.png" alt="NCAA Logo" fill className="object-contain" />
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Nigerian Civil Aviation Authority
                </p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  )
}
