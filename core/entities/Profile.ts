import { Category } from './Category'

export interface Profile {
    _id?: Number;
    netlifyID?: String;
    username: String;
    name: String;
    categories: Category[] | Number[];
    profileImage?: String | null;
    body: String;
    website: String | null;
    twitter: String | null;
    facebook: String | null;
    github: String | null;
    instagram: String | null;
}