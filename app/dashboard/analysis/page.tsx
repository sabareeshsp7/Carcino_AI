import { cookies } from "next/headers"
import { ImageAnalyzer } from "@/components/analysis/image-analyzer"

export default function AnalysisPage() {
  // Secure cookie access in a Server Component
  const cookieStore = cookies()
  const isAuthenticated = !!cookieStore.get("auth-token")?.value

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Carcinoma Cell Analysis</h1>

      {/* Pass authentication status to client component if needed */}
      <ImageAnalyzer />
    </div>
  )
}
