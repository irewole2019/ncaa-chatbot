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
23. Air ticket, charter and cargo sales charge.

PART VI—SAFETY REGULATIONS
30. Safety Oversight and Regulation.
31. Aircraft Operations and Maintenance Standards.
32. Personnel Licensing and Training Requirements.
33. Safety Management Systems.
34. Accident and Incident Investigation.
35. Safety Data Collection and Analysis.

PART VII—AIRCRAFT OPERATIONS
40. Aircraft Registration Requirements.
41. Airworthiness Certification.
42. Operating Certificates and Licenses.
43. Flight Operations and Standards.
44. Maintenance Requirements.
45. Flight Crew Requirements.`

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

// Improved search function with better relevance scoring
export async function searchSections(query: string) {
  try {
    const sections = await loadCivilAviationAct()
    const lowerQuery = query.toLowerCase()
    const queryTerms = lowerQuery.split(/\s+/).filter((term) => term.length > 2)

    // Score each section based on relevance to the query
    const scoredSections = sections.map((section) => {
      const titleLower = section.title.toLowerCase()
      const contentLower = section.content.toLowerCase()

      let score = 0

      // Check for exact phrase match (highest priority)
      if (titleLower.includes(lowerQuery) || contentLower.includes(lowerQuery)) {
        score += 100
      }

      // Check for individual term matches
      queryTerms.forEach((term) => {
        // Title matches are weighted higher
        if (titleLower.includes(term)) {
          score += 10
        }

        // Content matches
        if (contentLower.includes(term)) {
          score += 5

          // Bonus for multiple occurrences
          const occurrences = (contentLower.match(new RegExp(term, "g")) || []).length
          if (occurrences > 1) {
            score += Math.min(occurrences, 5) // Cap at 5 bonus points
          }
        }
      })

      return {
        ...section,
        score,
      }
    })

    // Filter out irrelevant sections and sort by score
    return scoredSections
      .filter((section) => section.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ score, ...section }) => section) // Remove the score property
  } catch (error) {
    console.error(`Failed to search sections for "${query}":`, error)
    return []
  }
}
