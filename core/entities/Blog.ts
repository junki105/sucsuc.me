import { Author } from './Author'
import { Hashtag } from './Hashtag'

export interface Blog {
    title: String;
    date: String;
    slug: String;
    description: String;
    body: String;
    hashtags: Hashtag[];
    author: Author;
}