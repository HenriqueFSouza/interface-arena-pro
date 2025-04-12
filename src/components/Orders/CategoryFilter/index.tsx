"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCategories } from "@/hooks/useCategories"

interface CategoryFilterProps {
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const { categories } = useCategories()

  return (
    <Tabs
      defaultValue={selectedCategory || "all"}
      onValueChange={(value) => onSelectCategory(value === "all" ? null : value)}
    >
      <TabsList className="flex justify-start h-auto gap-4 overflow-x-auto custom-scrollbar">
        <TabsTrigger value="all" className="flex-shrink-0">
          Todos
        </TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.id}>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
