interface GetProductDto {
    id: string
    category_id: string | null
    name: string
    slug: string
    product_image: string | null
    price: number
    description: string | null
}