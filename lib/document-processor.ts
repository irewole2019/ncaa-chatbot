// Function to load and process the Civil Aviation Act text
export async function loadCivilAviationAct() {
  try {
    // In production, this would load from the file system
    // For this demo, we'll use the text content directly
    const actContent = `
2022  No. 30           A 901 Civil Aviation Act, 2022
Federal Republic of Nigeria
Official Gazette
No. 153 Lagos - 24th  August, 2022 Vol. 109
Government Notice  No. 107
The following is published as supplement to this Gazette :
Act No. Short Title Page
30 Civil  Aviation  Act, 2022 .. .. .. .. .. .. .. A903-994

CIVIL AVIATION ACT, 2022
\\
ARRANGEMENT  OF  SECTIONS
Section :
PART I — OBJECTIVES, APPLICATION  AND CONTROL OF CIVIL AVIATION
1. Objectives.
2. Application of this Act.
3. Control of civil aviation.
PART II—ESTABLISHMENT  OF THE NIGERIA CIVIL AVIATION AUTHORITY
4. Establishment of the Nigeria Civil Aviation Authority.
5. Establishment of the Governing Board.
6. Tenure of office of the Chairman and members of the Board.
7. Allowances, expenses and any other entitlement of Chairman and
members of the Board.
PART III—FUNCTIONS AND POWERS OF THE AUTHORITY
8. Functions of the Authority.
9. Powers of the Authority.
10. Functions and powers of the Board.
PART IV—MANAGEMENT  AND STAFF OF THE AUTHORITY
11. Appointment and tenure of the Director-General.
12. Appointment of Secretary to the Board.
13. Other staff of the Authority.
14. Service in the Authority to be pensionable.
15. Appointment of experts.
16. Establishment of Directorates and Inspectorates.
PART V—FINANCIAL PROVISIONS
17. Funds of the Authority.
18. Expenditure of the Authority.
19. Power to accept gifts.
20. Power to borrow and invest.
21. Power to impose fees for services.
22. Exemption from tax.
23. Air ticket, charter and cargo sales charge.`

    // Process the content into sections
    return processActContent(actContent)
  } catch (error) {
    console.error("Error loading Civil Aviation Act:", error)
    return []
  }
}

// Process the Civil Aviation Act content into sections
function processActContent(content: string) {
  const sections = []
  const lines = content.split("\n")

  let currentPart = null
  let currentSection = null
  let currentContent = []
  let currentTitle = ""

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip empty lines
    if (!line) continue

    // Check if this is a part header (e.g., "PART I — OBJECTIVES...")
    if (line.startsWith("PART ")) {
      if (currentSection) {
        sections.push({
          id: `section-${currentPart}-${currentSection}`,
          title: currentTitle,
          content: currentContent.join("\n"),
          part: currentPart,
        })
      }

      currentPart = line.split(" ")[1].replace("—", "")
      currentTitle = line
      currentContent = [line]
      currentSection = null
    }
    // Check if this is a numbered section (e.g., "1. Objectives.")
    else if (/^\d+\./.test(line)) {
      if (currentSection) {
        sections.push({
          id: `section-${currentPart}-${currentSection}`,
          title: currentTitle,
          content: currentContent.join("\n"),
          part: currentPart,
        })
      }

      currentSection = line.split(".")[0]
      currentTitle = line
      currentContent = [line]
    }
    // Otherwise, add to current content
    else {
      currentContent.push(line)
    }
  }

  // Add the last section
  if (currentSection) {
    sections.push({
      id: `section-${currentPart}-${currentSection}`,
      title: currentTitle,
      content: currentContent.join("\n"),
      part: currentPart,
    })
  }

  return sections
}

// Get all sections from the Civil Aviation Act
export async function getSections() {
  try {
    return await loadCivilAviationAct()
  } catch (error) {
    console.error("Failed to get sections:", error)
    return []
  }
}

// Get sections by part
export async function getSectionsByPart(part: string) {
  try {
    const sections = await loadCivilAviationAct()
    return sections.filter((section) => section.part === part)
  } catch (error) {
    console.error(`Failed to get sections for part ${part}:`, error)
    return []
  }
}

// Search sections by query
export async function searchSections(query: string) {
  try {
    const sections = await loadCivilAviationAct()
    const lowerQuery = query.toLowerCase()

    return sections.filter(
      (section) =>
        section.title.toLowerCase().includes(lowerQuery) || section.content.toLowerCase().includes(lowerQuery),
    )
  } catch (error) {
    console.error(`Failed to search sections for "${query}":`, error)
    return []
  }
}
