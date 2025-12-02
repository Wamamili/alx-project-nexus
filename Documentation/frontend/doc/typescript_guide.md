TypeScript Guide

This document outlines the TypeScript conventions used across the frontend. The goal is consistency, safety, and clarity across components, APIs, and application logic.

File and Folder Rules

All TypeScript files use .ts for logic and .tsx for React components.

All shared types live in a dedicated folder:

src/types/


Component-specific types stay in the same folder as the component when scoped.

API response types are placed under:

src/types/api/

Using Interfaces and Types
Interfaces

Use for objects with clear structure and when extending is likely.

export interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
}

Types

Use for unions, primitives, functions, and more flexible shapes.

export type Status = "success" | "error" | "pending"

When to Prefer Each

Interface for models and entities.

Type for unions, function signatures, and complex compositions.

Enums

Prefer string enums for clarity in UI states and API mapping.

export enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  SHIPPED = "shipped",
  CANCELLED = "cancelled"
}

Typing API Calls

All API functions include typed request and response shapes.

Example
import { Product } from "../types/product"

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/products")
  return res.json()
}


Organize all service functions inside:

src/services/

Typing Props

Every component receives a dedicated Props type.

type ProductCardProps = {
  product: Product
  onSelect: (id: string) => void
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <div onClick={() => onSelect(product.id)}>
      {product.name}
    </div>
  )
}

Typing Forms

Use strict typing for form values to avoid runtime errors.

export type LoginForm = {
  email: string
  password: string
}


Example with React Hook Form:

const { register } = useForm<LoginForm>()

Typing Custom Hooks

Hooks must define both input and output types.

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  function add(item: CartItem) {
    setItems(prev => [...prev, item])
  }

  return { items, add }
}


If the hook accepts parameters:

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  ...
}

Common Patterns
Readonly Data
readonly id: string

Partial Updates
type ProductUpdate = Partial<Product>

Record Maps
type StockMap = Record<string, number>

Utility Types

Use built-in utility types:

Partial

Pick

Omit

Record

ReturnType

Awaited

Error Handling Types

API calls return predictable errors:

export type ApiError = {
  message: string
  status: number
}


Services wrap errors:

throw { message: "Failed", status: res.status } as ApiError
