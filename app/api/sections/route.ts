import { NextResponse } from "next/server"
import { getSections, getSectionsByPart, searchSections } from "@/lib/document-processor"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const part = url.searchParams.get("part")
    const query = url.searchParams.get("query")

    let sections

    if (query) {
      sections = await searchSections(query)
    } else if (part) {
      sections = await getSectionsByPart(part)
    } else {
      sections = await getSections()
    }

    return NextResponse.json({ sections })
  } catch (error) {
    console.error("Failed to get sections:", error)
    return NextResponse.json(
      {
        error: "Failed to get sections",
        message: error instanceof Error ? error.message : "Unknown error",
        sections: [],
      },
      { status: 200 }, // Return 200 instead of 500 to prevent breaking the UI
    )
  }
}
