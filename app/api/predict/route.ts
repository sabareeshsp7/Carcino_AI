import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL = process.env.API_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    // Correctly access cookies in a Route Handler
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")?.value

    const formData = await request.formData()

    // Forward the request to the FastAPI backend
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        // Include auth token if available
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.detail || "Failed to process image" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in predict API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
