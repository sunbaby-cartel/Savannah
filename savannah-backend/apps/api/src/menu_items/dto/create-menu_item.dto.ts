export class CreateMenuItemDto {
    id: string
    available_quantity: number
    category: string
    created_at: string
    description: string
    dietary_tags: string[]
    image_gradient: string
    is_available: boolean
    name: string
    preparation_time_minutes: number
    price: number
    total_quantity: number
    updated_at: string
}
