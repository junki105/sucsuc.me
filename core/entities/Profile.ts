import { Category } from './Category'
import { Product, convertProduct } from './Product'

export interface Profile {
    _id?: Number;
    netlifyID?: String;
    username: String;
    name: String;
    profileImage?: String | null;
    body: String;
    website: String | null;
    twitter: String | null;
    facebook: String | null;
    github: String | null;
    instagram: String | null;
    categories: Category[] | Number[];
    products: Product[];
}

export function convertProfile(data: any): Profile {
    return {
        ...data,
        categories: data.categories.data as Category[],
        products: data.products && data.products.data && data.products.data.filter((d: Product) => d).length > 0
            ? data.products.data.filter((v: Product) => v).map((p: Product) => convertProduct(p)) as Product[]
            : []
    }
}