/** Represents a single product from DummyJSON API */
export interface Product {
    id: number
    title: string
    description: string
    price: number
    discountPercentage: number
    rating: number
    stock: number
    brand: string
    category: string
    thumbnail: string
    images: string[]
    tags: string[]
}

/** Response shape from GET /products */
export interface ProductsResponse {
    products: Product[]
    total: number
    skip: number
    limit: number
}


export interface CategoryInfo {
    slug: string
    name: string
    url: string
}

/** An item in the shopping cart */
export interface CartItem {
    product: Product
    quantity: number
}

/** Authenticated user info */
export interface AuthUser {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    image: string
    accessToken: string
    refreshToken: string
}

/** Login request payload */
export interface LoginCredentials {
    username: string
    password: string
}

/** Auth API response */
export interface AuthResponse {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    gender: string
    image: string
    accessToken: string
    refreshToken: string
}
