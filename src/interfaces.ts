// Interfaces that are shared in multiple files

export interface Product {
  id: number
  title: string
  category: string
  brand: string
  price: number
  thumbnail: string
}

export interface ProductsResponse {
  products: Product[]
}

export interface PostResponse {
  id: number
  title: string
  body: string
  userId: number
}
