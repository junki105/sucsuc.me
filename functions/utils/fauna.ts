import axios from 'axios';

export interface Context {
    query: string;
    variables: {
        [k: string]: string | null;
    };
}

const faunaFetch = async (context: Context) => {
    return await axios('https://graphql.fauna.com/graphql', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.FAUNA_SERVER_KEY}`,
            },
            data: JSON.stringify(context),
        })
        .then((res) => res.data)
        .catch((err) => console.error(JSON.stringify(err, null, 2)))
    ;
};

export default faunaFetch