"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton"
import { Input } from "./ui/input"
import { Search } from "lucide-react"
import { Card } from "./ui/card"

interface Section {
  id: string
  title: string
  content: string
  part?: string
}

export function ActViewer() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/sections")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.message || data.error)
        }

        setSections(data.sections || [])
      } catch (error) {
        console.error("Failed to fetch sections:", error)
        setError(error instanceof Error ? error.message : "Failed to load sections")
        setSections([]) // Set empty array to prevent undefined errors
      } finally {
        setLoading(false)
      }
    }

    fetchSections()
  }, [])

  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    // Check if there's a hash in the URL and scroll to that section
    if (window.location.hash && !loading) {
      const sectionId = window.location.hash.substring(1)
      setActiveSection(sectionId)
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [sections, loading])

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4">
          <div className="relative w-20 h-20 mx-auto">
            <Image src="/ncaa-logo.png" alt="NCAA Logo" fill className="object-contain" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-red-600">Error Loading Document</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <p className="text-sm">Please try again later or contact support if the issue persists.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-4 relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search sections..."
          className="pl-8 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))
        ) : filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <Card
              key={section.id}
              id={section.id}
              className={`p-4 transition-all ${
                activeSection === section.id
                  ? "ring-2 ring-blue-500 dark:ring-blue-400"
                  : "hover:border-blue-200 dark:hover:border-blue-800"
              }`}
            >
              <h3 className="text-md font-semibold mb-2 text-blue-700 dark:text-blue-400">{section.title}</h3>
              <div className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">{section.content}</div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {searchTerm ? "No sections found matching your search." : "No sections available."}
          </div>
        )}
      </div>
    </div>
  )
}
