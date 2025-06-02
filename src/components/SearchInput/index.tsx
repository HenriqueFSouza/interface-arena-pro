import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchInputProps {
    search: string
    placeholder?: string
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SearchInput({ search, handleSearch, placeholder = "Pesquisar..." }: SearchInputProps) {
    return (
        <div className="mb-4 relative bg-card rounded-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
                autoFocus
                placeholder={placeholder}
                className="pl-10"
                value={search}
                onChange={handleSearch}
            />
        </div>
    )
}


