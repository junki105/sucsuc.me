import { Profile } from '../../core/entities/Profile'
import { Category } from '../../core/entities/Category'

export function convertProfile(data: any): Profile {
    return {
        ...data,
        categories: data.categories.data as Category[]
    }
}