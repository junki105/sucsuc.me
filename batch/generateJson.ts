import faunaFetch, { Fauna } from '../functions/utils/fauna'
import * as fs from 'fs';

import { Category } from '../core/entities/Category'
import { Hashtag } from '../core/entities/Hashtag'
import { Product, convertProduct, STATUS_ACTIVE } from '../core/entities/Product'
import { Profile, convertProfile } from '../core/entities/Profile'

const main = async () => {
    const categoryResult = await faunaFetch({
        query: Fauna.Query.allCategories,
        variables: {},
    });
    const categories: Category[] = categoryResult.data ? categoryResult.data.allCategories.data : []
    fs.writeFile('./client/content/category.json', JSON.stringify({ categories }, null, '    '), () => {});

    const hashtagResult = await faunaFetch({
        query: Fauna.Query.allHashtags,
        variables: {},
    });
    const hashtags: Hashtag[] = hashtagResult.data ? hashtagResult.data.allHashtags.data : []
    fs.writeFile('./client/content/hashtag.json', JSON.stringify({ hashtags }, null, '    '), () => {});


    fs.mkdir('./client/content/author', { recursive: true }, (err) => {
        if (err) throw err;
    });
    fs.mkdir('./client/content/blog', { recursive: true }, (err) => {
        if (err) throw err;
    });
    fs.mkdir('./client/content/product', { recursive: true }, (err) => {
        if (err) throw err;
    });

    const productResult = await faunaFetch({
        query: Fauna.Query.allProducts,
        variables: {},
    });
    const products: Product[] = hashtagResult.data
        ? productResult.data.allProducts.data
            .filter((p: Product) => p)
            .map((p: Product) => convertProduct(p))
        : []
    products.forEach((product: Product) => {
        if (product.status === STATUS_ACTIVE && !!product.author) {
            const author: Profile = convertProfile(product.author)
            fs.writeFile(`./client/content/author/${product.author._id}.json`, JSON.stringify({ ...author }, null, '    '), () => {});
            fs.writeFile(`./client/content/product/${product.uuid}.json`, JSON.stringify({ ...product }, null, '    '), () => {});
        }
    })
};

main();