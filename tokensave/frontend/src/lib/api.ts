export interface UploadResult {
  filename: string
  text: string
  markdown: string
  word_count: number
  character_count: number
  line_count: number
  estimated_tokens: number
  estimated_tokens_gpt: number
  estimated_tokens_claude: number
  estimated_tokens_gemini: number
  optimized_text: string
  optimized_tokens: number
  saved_tokens: number
  saving_percentage: number
  file_size_bytes: number
  processing_time_sec: number
  extraction_status: string
  warnings?: string[]
}

// Future AI integration interfaces
export interface AISummaryResult {
  summary: string
  estimated_tokens: number
  processing_time_sec: number
}

export interface AIRequirementItem {
  id: string
  title: string
  description: string
  category: string
  priority: string
}

export interface AIBrdResult {
  requirements: AIRequirementItem[]
  summary: string
  processing_time_sec: number
}

export interface AIAcceptanceCriteria {
  scenario: string
  given: string
  when: string
  then: string
}

export interface AIUserStoryItem {
  id: string
  title: string
  as_a: string
  i_want_to: string
  so_that: string
  acceptance_criteria: AIAcceptanceCriteria[]
  uat_test_cases: string[]
}

export interface AIUserStoryResult {
  user_stories: AIUserStoryItem[]
  processing_time_sec: number
}

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://tokensave-backend.up.railway.app"

export async function uploadDocument(file: File, fastMode: boolean = true): Promise<UploadResult> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("fast_mode", fastMode ? "true" : "false")

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    let message = `Upload failed (${res.status})`
    try {
      const data = await res.json()
      if (data?.detail) message = data.detail
    } catch {
      /* ignore json parse errors */
    }
    throw new Error(message)
  }

  return (await res.json()) as UploadResult
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`)
    return res.ok
  } catch {
    return false
  }
}

// Mock AI fetchers pointing to extensible backend endpoints
export async function summarizeText(
  text: string,
  style: "bullet" | "paragraph" = "bullet",
  length: "short" | "medium" | "long" = "medium"
): Promise<AISummaryResult> {
  const res = await fetch(`${API_URL}/ai/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, style, length }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || "AI Summary generation failed")
  }
  return res.json()
}

export async function analyzeBrd(text: string): Promise<AIBrdResult> {
  const res = await fetch(`${API_URL}/ai/analyze-brd`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || "BRD analysis failed")
  }
  return res.json()
}

export async function generateUserStories(text: string): Promise<AIUserStoryResult> {
  const res = await fetch(`${API_URL}/ai/generate-stories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || "User stories generation failed")
  }
  return res.json()
}

export { API_URL }
