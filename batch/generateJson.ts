import faunaFetch, { Fauna } from '../functions/utils/fauna'
import * as fs from 'fs';

import { Category } from '../core/entities/Category'

const main = async () => {
    const categoryResult = await faunaFetch({
        query: Fauna.Query.allCategories,
        variables: {},
    });
    const categories: Category[] = categoryResult.data ? categoryResult.data.allCategories.data : []
    fs.writeFile('./client/content/category.json', JSON.stringify({ categories }, null, '    '), () => {});
};

main();