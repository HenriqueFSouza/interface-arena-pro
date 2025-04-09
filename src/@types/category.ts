import { Product } from "./product"

export interface Category {
    id: string
    name: string
    imageUrl?: string
    products?: Product[]
}