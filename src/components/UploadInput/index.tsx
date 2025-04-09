"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ImagePlus, Trash } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"

interface ImageUploadProps {
    value: string
    onChange: (value: string) => void
    onRemove: () => void
    disabled?: boolean
}

export default function UploadInput({ value, onChange, onRemove, disabled }: ImageUploadProps) {
    const [loading, setLoading] = useState(false)

    const handleUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (!file) return

            setLoading(true)

            // In a real app, you would upload the file to your storage service
            // and get back a URL to display the image
            const reader = new FileReader()
            reader.onloadend = () => {
                onChange(reader.result as string)
                setLoading(false)
            }
            reader.readAsDataURL(file)
        },
        [onChange],
    )

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {value ? (
                <div className="relative w-full h-40">
                    <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover rounded-md" />
                    <Button
                        type="button"
                        onClick={onRemove}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        disabled={disabled}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="w-full">
                    <label
                        htmlFor="imageUpload"
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md cursor-pointer bg-muted/50 transition-colors",
                            "hover:bg-muted/70 hover:border-neutral-300",
                            disabled && "opacity-50 cursor-not-allowed",
                        )}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImagePlus className="w-8 h-8 mb-2 text-neutral-500" />
                            <p className="text-sm text-neutral-500">
                                <span className="font-medium">Clique para carregar</span> ou arraste e solte
                            </p>
                            <p className="text-xs text-neutral-500">PNG, JPG ou WEBP (máx. 2MB)</p>
                        </div>
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleUpload}
                            disabled={disabled || loading}
                        />
                    </label>
                </div>
            )}
        </div>
    )
}
