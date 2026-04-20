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
 * Search products by query string
 */
export async function searchProducts(query: string): Promise<ProductsResponse> {
    const response = await fetchWithRetry(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}`)
    const data: ProductsResponse = await response.json()
    return data
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
