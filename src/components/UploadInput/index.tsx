"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ImagePlus, Loader2, Trash } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { toast } from "react-hot-toast"

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ImageUploadProps {
    value: string | undefined
    onChange: (value: string) => void
    onRemove: () => void
    onFileSelect?: (file: File | null) => void
    disabled?: boolean
    loading?: boolean
}

export default function UploadInput({
    value,
    onChange,
    onRemove,
    onFileSelect,
    disabled,
    loading = false
}: ImageUploadProps) {
    const [localLoading, setLocalLoading] = useState(false)

    const isLoading = loading || localLoading

    const handleUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (!file) return

            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                toast.error("Arquivo muito grande. O tamanho máximo é 5MB.");
                e.target.value = "";
                return;
            }

            setLocalLoading(true)

            // Pass the file to parent component
            if (onFileSelect) {
                onFileSelect(file);
            }

            // Create a preview
            const reader = new FileReader()
            reader.onloadend = () => {
                onChange(reader.result as string)
                setLocalLoading(false)
            }
            reader.readAsDataURL(file)
        },
        [onChange, onFileSelect],
    )

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {value ? (
                <div className="relative w-40 aspect-square">
                    <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover rounded-md" />
                    <Button
                        type="button"
                        onClick={() => {
                            onRemove();
                            if (onFileSelect) {
                                onFileSelect(null);
                            }
                        }}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        disabled={disabled || isLoading}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>

                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full">
                    <label
                        htmlFor="imageUpload"
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md cursor-pointer bg-white transition-colors",
                            "hover:bg-white/70 hover:border-neutral-300",
                            (disabled || isLoading) && "opacity-50 cursor-not-allowed",
                        )}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {isLoading ? (
                                <Loader2 className="w-8 h-8 mb-2 text-neutral-500 animate-spin" />
                            ) : (
                                <ImagePlus className="w-8 h-8 mb-2 text-neutral-500" />
                            )}

                            <p className="text-sm text-neutral-500">
                                <span className="font-medium">Clique para carregar</span> ou arraste e solte
                            </p>
                            <p className="text-xs text-neutral-500">PNG, JPG ou WEBP (máx. 5MB)</p>
                        </div>
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleUpload}
                            disabled={disabled || isLoading}
                        />
                    </label>
                </div>
            )}
        </div>
    )
}
