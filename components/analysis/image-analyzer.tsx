"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type PredictionResult = {
  prediction: string
  confidence: number
  class_probabilities: Record<string, number>
  heatmap_image: string
}

export function ImageAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPEG or PNG image.",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 5MB.",
      })
      return
    }
    setSelectedFile(file)

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
    setResult(null)
    setError(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPEG or PNG image.",
      })
      return
    }

    setFileName(file.name)
    setSelectedFile(file)

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
    setResult(null)
    setError(null)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Create FormData and append the file directly
      const formData = new FormData()
      formData.append("file", selectedFile)

      // Send to API
      const res = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to analyze image")
      }

      const data = await res.json()
      setResult(data)

        // Show success toast
        if (data.prediction === "Carcinoma") {
          toast.error("Analysis Complete", {
            description: `Prediction: ${data.prediction} with ${(data.confidence * 100).toFixed(2)}% confidence`,
          })
        } else {
          toast.success("Analysis Complete", {
            description: `Prediction: ${data.prediction} with ${(data.confidence * 100).toFixed(2)}% confidence`,
          })
        }
      } catch (err) {
        toast.error("Analysis Failed", {
          description: err instanceof Error ? err.message : "An unknown error occurred",
        })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setSelectedImage(null)
    setSelectedFile(null)
    setFileName("")
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Skin Lesion Analysis</CardTitle>
          <CardDescription>Upload an image of a skin lesion for AI-powered carcinoma detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center ${
              selectedImage ? "border-primary" : "border-muted-foreground/25"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {!selectedImage ? (
              <>
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Upload Image</h3>
                <p className="text-sm text-muted-foreground mb-4">Drag and drop an image, or click to browse</p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Select Image
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageChange}
                  aria-label="Upload skin lesion image"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="sr-only">Upload skin lesion image</label>
              </>
            ) : (
              <div className="relative w-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 z-10 rounded-full bg-background/80"
                  onClick={resetAnalysis}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md h-64 mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected skin lesion"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{fileName}</p>
                  <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full max-w-xs">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Image"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {isAnalyzing && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-center text-muted-foreground">Analyzing image with AI model...</p>
              <Progress value={45} className="h-2" />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">Analysis Results</span>
              {result.prediction === "Carcinoma" ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </CardTitle>
            <CardDescription>AI-powered analysis of your skin lesion image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Prediction</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Classification</p>
                    <div
                      className={`text-lg font-bold ${
                        result.prediction === "Carcinoma" ? "text-destructive" : "text-green-500"
                      }`}
                    >
                      {result.prediction}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Confidence</p>
                    <div className="text-lg font-bold">{(result.confidence * 100).toFixed(2)}%</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Class Probabilities</p>
                    <div className="space-y-2">
                      {Object.entries(result.class_probabilities).map(([className, probability]) => (
                        <div key={className}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{className}</span>
                            <span>{(probability * 100).toFixed(2)}%</span>
                          </div>
                          <Progress
                            value={probability * 100}
                            className={`h-2 ${className === "Carcinoma" ? "[&>div]:bg-destructive" : "[&>div]:bg-green-500"}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Heatmap Analysis</h3>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                  <Image
                    src={`data:image/png;base64,${result.heatmap_image}`}
                    alt="Analysis heatmap"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Heatmap showing regions of interest identified by the AI model
                </p>
              </div>
            </div>

            {result.prediction === "Carcinoma" && (
              <Alert className="bg-destructive/10 text-destructive border-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Potential Carcinoma Detected</AlertTitle>
                <AlertDescription>
                  Our AI model has detected potential carcinoma cells in your image. Please consult with a healthcare
                  professional for proper diagnosis and treatment options.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetAnalysis}>
              Analyze Another Image
            </Button>
            <Button
              variant="default"
              onClick={() => {
                // In a real app, this would navigate to appointment booking
                window.location.href = "/dashboard/appointments"
              }}
            >
              Book Consultation
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
