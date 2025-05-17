"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Upload, X } from "lucide-react"

interface FileUploadProps {
  onFileChange: (file: File | null) => void
}

export function FileUpload({ onFileChange }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    onFileChange(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const selectedFile = e.dataTransfer.files?.[0] || null
    setFile(selectedFile)
    onFileChange(selectedFile)
  }

  const removeFile = () => {
    setFile(null)
    onFileChange(null)
  }

  return (
    <div>
      {!file ? (
        <div
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            isDragging
              ? "border-purple-500 bg-purple-500/10"
              : "border-gray-700 hover:border-purple-500 hover:bg-purple-500/5"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mb-2 h-8 w-8 text-gray-400" />
          <p className="mb-2 text-sm font-medium text-gray-300">
            Drag & drop file or{" "}
            <label className="cursor-pointer text-purple-400 hover:text-purple-300">
              browse
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>
          </p>
          <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, JPEG, or PNG (max. 10MB)</p>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900/50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/50">
              <FileText className="h-5 w-5 text-purple-300" />
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={removeFile}>
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      )}
    </div>
  )
}
