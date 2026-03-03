import type { Product, ProductsResponse, CategoryInfo, AuthResponse, LoginCredentials } from '../types'

const BASE_URL = 'https://dummyjson.com'

/**
 * Fetch all products (up to 100)
 */
export async function fetchProducts(): Promise<ProductsResponse> {
    const response = await fetch(`${BASE_URL}/products?limit=100`)
    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`)
    }
    const data: ProductsResponse = await response.json()
    return data
}

/**
 * Fetch a single product by ID
 */
export async function fetchProduct(id: number): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`)
    if (!response.ok) {
        throw new Error(`Failed to fetch product ${id}: ${response.statusText}`)
    }
    const data: Product = await response.json()
    return data
}

/**
 * Fetch all product categories
 */
export async function fetchCategories(): Promise<CategoryInfo[]> {
    const response = await fetch(`${BASE_URL}/products/categories`)
    if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }
    const data: CategoryInfo[] = await response.json()
    return data
}

/**
 * Search products by query string
 */
export async function searchProducts(query: string): Promise<ProductsResponse> {
    const response = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
        throw new Error(`Failed to search products: ${response.statusText}`)
    }
    const data: ProductsResponse = await response.json()
    return data
}

/**
 * Fetch products by category
 */
export async function fetchProductsByCategory(category: string): Promise<ProductsResponse> {
    const response = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`)
    if (!response.ok) {
        throw new Error(`Failed to fetch category products: ${response.statusText}`)
    }
    const data: ProductsResponse = await response.json()
    return data
}

/**
 * Login using DummyJSON auth endpoint
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    })
    if (!response.ok) {
        throw new Error('Invalid username or password')
    }
    const data: AuthResponse = await response.json()
    return data
}
