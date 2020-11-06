import { Category } from './Category'

export interface Author {
    username: String;
    title: String;
    profilePicture: String;
    body: String;
    categories: Category[];
    website: String | null;
    github: String | null;
    twitter: String | null;
    email: String | null;
    slug: String;
}