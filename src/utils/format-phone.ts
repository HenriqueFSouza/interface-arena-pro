export function formatPhoneNumber(value: string): string {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '')

    // Apply the Brazilian phone format: (00) 00000-0000
    return digits
        .replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, (_, g1, g2, g3) => {
            if (!g1) return ''
            if (!g2) return `(${g1}`
            if (!g3) return `(${g1}) ${g2}`
            return `(${g1}) ${g2}-${g3}`
        })
        .slice(0, 15) // Max length of (00) 00000-0000
} 