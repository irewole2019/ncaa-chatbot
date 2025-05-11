import { ChatInterface } from "@/components/chat-interface"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Civil Aviation Act Chatbot</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Ask questions about the Civil Aviation Act of Nigeria (2022) and get accurate answers with section
              references
            </p>
          </div>
          <ChatInterface />
        </div>
      </main>
      <footer className="border-t py-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          NCAA Civil Aviation Act Chatbot &copy; {new Date().getFullYear()} | For internal use only
        </div>
      </footer>
    </div>
  )
}
