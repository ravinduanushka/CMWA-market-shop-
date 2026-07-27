import type { Product, ProductsResponse, CategoryInfo, AuthResponse, LoginCredentials, RegistrationData } from '../types'

const BASE_URL = 'https://dummyjson.com'

/**
 * Retry wrapper – retries a fetch up to `maxRetries` times with exponential backoff.
 * Handles both network errors ("Failed to fetch") and non-ok HTTP responses.
 */
async function fetchWithRetry(
    url: string,
    options?: RequestInit,
    maxRetries = 3
): Promise<Response> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options)
            if (response.ok) return response

            // Don't retry client errors (4xx) – only retry server errors (5xx)
            if (response.status >= 400 && response.status < 500) {
                throw new Error(`Request failed: ${response.statusText}`)
            }

            lastError = new Error(`Server error: ${response.status} ${response.statusText}`)
        } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err))
        }

        // Wait before retrying (exponential backoff: 500ms, 1s, 2s …)
        if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt)))
        }
    }

    throw lastError ?? new Error('Failed to fetch')
}

/**
 * Fetch all products (up to 100)
 */
export async function fetchProducts(): Promise<ProductsResponse> {
    const response = await fetchWithRetry(`${BASE_URL}/products?limit=100`)
    const data: ProductsResponse = await response.json()
    return data
}

/**
 * Fetch a single product by ID
 */
export async function fetchProduct(id: number): Promise<Product> {
    const response = await fetchWithRetry(`${BASE_URL}/products/${id}`)
    const data: Product = await response.json()
    return data
}

/**
 * Fetch all product categories
 */
export async function fetchCategories(): Promise<CategoryInfo[]> {
    const response = await fetchWithRetry(`${BASE_URL}/products/categories`)
    const data: CategoryInfo[] = await response.json()
    return data
}

/**
 * Search products by query string (searches title, description, category, brand, and tags)
 */
export async function searchProducts(query: string): Promise<ProductsResponse> {
    const q = query.trim().toLowerCase()
    if (!q) return fetchProducts()

    try {
        // Fetch products from both search endpoint and full products list to ensure complete results
        const [searchRes, allRes] = await Promise.all([
            fetchWithRetry(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=100`)
                .then(res => res.json() as Promise<ProductsResponse>)
                .catch(() => ({ products: [], total: 0, skip: 0, limit: 100 })),
            fetchProducts().catch(() => ({ products: [], total: 0, skip: 0, limit: 100 }))
        ])

        // Merge products by ID to eliminate duplicates
        const productMap = new Map<number, Product>()
        searchRes.products.forEach(p => productMap.set(p.id, p))
        allRes.products.forEach(p => productMap.set(p.id, p))

        const combinedProducts = Array.from(productMap.values())

        // Comprehensive filter across title, description, category, brand, and tags
        const filtered = combinedProducts.filter(p => {
            const titleMatch = p.title ? p.title.toLowerCase().includes(q) : false
            const descMatch = p.description ? p.description.toLowerCase().includes(q) : false
            const catMatch = p.category ? p.category.toLowerCase().includes(q) : false
            const brandMatch = p.brand ? p.brand.toLowerCase().includes(q) : false
            const tagsMatch = p.tags ? p.tags.some(t => t.toLowerCase().includes(q)) : false

            return titleMatch || descMatch || catMatch || brandMatch || tagsMatch
        })

        return {
            products: filtered,
            total: filtered.length,
            skip: 0,
            limit: filtered.length,
        }
    } catch {
        return { products: [], total: 0, skip: 0, limit: 0 }
    }
}

/**
 * Fetch products by category
 */
export async function fetchProductsByCategory(category: string): Promise<ProductsResponse> {
    const response = await fetchWithRetry(`${BASE_URL}/products/category/${encodeURIComponent(category)}`)
    const data: ProductsResponse = await response.json()
    return data
}

/**
 * Login using DummyJSON auth endpoint
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetchWithRetry(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    }, 1)  // Only 1 retry for login
    if (!response.ok) {
        throw new Error('Invalid username or password')
    }
    const data: AuthResponse = await response.json()
    return data
}

/**
 * Register a new user using DummyJSON "Add user" endpoint
 */
export async function registerUser(data: RegistrationData): Promise<AuthResponse> {
    const response = await fetchWithRetry(`${BASE_URL}/users/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }, 1)
    if (!response.ok) {
        throw new Error('Registration failed')
    }
    const result = await response.json()
    // Mock tokens and default avatar as DummyJSON users/add doesn't return them
    return {
        ...result,
        image: result.image || `https://robohash.org/${result.username}?set=set4`,
        accessToken: 'mock-access-token-' + result.id,
        refreshToken: 'mock-refresh-token-' + result.id,
    }
}
