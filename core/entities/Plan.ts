import { Author } from './Author'
import { Hashtag } from './Hashtag'

export interface Plan {
    uuid: String;
    title: String;
    status: String;
    slug: String;
    description: String;
    body: String;
    price: Number;
    interval: String;
    hashtags: Hashtag[];
    author: Author;
    authorId?: String;
}