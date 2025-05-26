import { cookies } from "next/headers"
import { ImageAnalyzer } from "@/components/analysis/image-analyzer"

export default async function Page() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth-token')?.value
  const isAuthenticated = !!authToken
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Carcinoma Cell Analysis</h1>
<div>
      {isAuthenticated ? "Welcome!" : "Analyze Image"}
    </div>
      {/* Pass authentication status to client component if needed */}
      <ImageAnalyzer />
    </div>
  )
}
