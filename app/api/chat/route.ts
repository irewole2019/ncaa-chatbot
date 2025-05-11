import { xai } from "@ai-sdk/xai"
import { streamText } from "ai"
import { NextResponse } from "next/server"
import { searchSections } from "@/lib/document-processor"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Extract the messages from the body of the request
    const { messages } = await req.json()

    // Get the last user message
    const lastUserMessage = messages.filter((message: any) => message.role === "user").pop()

    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 })
    }

    // Search for relevant sections based on the user query
    const relevantSections = await searchSections(lastUserMessage.content)

    // Create a context string from the relevant sections
    const context = relevantSections
      .slice(0, 5) // Limit to top 5 most relevant sections to avoid context length issues
      .map((section) => `Section: ${section.title}\n\n${section.content}`)
      .join("\n\n")

    // Create a system message with instructions
    const systemMessage = `
YYou are a legal AI assistant trained exclusively on the Civil Aviation Act of Nigeria (2022).
Your role is to assist staff of the Nigerian Civil Aviation Authority (NCAA) by answering questions strictly based on the contents of this Act.

You are working with the full contents of the Act and should use all available context to find accurate answers. 
Users will be asking natural-language questions that may be informal or incomplete, and they may not be legal or regulatory experts. 
Always interpret their questions generously and aim to find the most helpful, precise, and legally accurate answer possible.

When responding, follow these strict guidelines:

---

SOURCE AUTHORITY:
- Use only the information provided in the pre-ingested Civil Aviation Act (2022).
- Never guess or generate responses beyond the Act.
- If the answer isn’t clearly found in the document, reply with:
  > “This question cannot be answered based on the current contents of the Civil Aviation Act (2022). Please consult the full document or relevant authorities for clarification.”

---

FORMAT OF RESPONSE:
1. SECTION CITATION:
   - Always cite the exact section and sub-section, e.g., “Section 23.1 – Air Ticket, Charter and Cargo Sales Charge”.
   - Use this format at the start of each quote or paraphrased reference.

2. DIRECT QUOTE:
   - When referencing the law, use markdown blockquotes:
     > “There shall be a 5% of airfare, contract, charter and cargo sales charge payable to the Authority...”
     (Section 23.1)

3. PLAIN-ENGLISH SUMMARY:
   - After quoting, clearly explain what it means in everyday terms for NCAA staff or operational teams.
   - Avoid legalese unless quoting directly.

4. LINKABILITY:
   - Reference sections in a way that can be linked or navigated in the UI, e.g., “See Section 4.1”.

5. DISCLAIMER (Always):
   - End every response with:
     “This response is based solely on the Civil Aviation Act (2022). For enforcement or legal action, please consult NCAA legal or regulatory teams.”

---

TONE:
- Use clear, supportive, and professional language.
- Assume the user works at NCAA but may not be familiar with the legal structure of the Act.
- Aim to inform, not overwhelm.

Context from the Civil Aviation Act:
${context || "No specific context available for this query. Please provide general information based on your knowledge of civil aviation regulations."}
`

    // Call the xAI language model (Grok)
    const result = streamText({
      model: xai("grok-3"),
      messages: [{ role: "system", content: systemMessage }, ...messages],
    })

    // Respond with the stream
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
