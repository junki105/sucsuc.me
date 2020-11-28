import axios from 'axios'

export namespace Fauna {
    export namespace Query {
        export const allCategories = `
            query {
                allCategories {
                    data {
                        _id
                        label
                        value
                    }
                }
            }
        `
        export const allHashtags = `
            query {
                allHashtags {
                    data {
                        _id
                        label
                        value
                        icon
                    }
                }
            }
        `
        export const getCustomerByNetlifyID = `
            query ($netlifyID: ID!) {
                getCustomerByNetlifyID(netlifyID: $netlifyID) {
                    stripeID
                }
            }
        `
        export const getCustomerByStripeID = `
            query ($stripeID: ID!) {
                getCustomerByStripeID(stripeID: $stripeID) {
                    _id
                    netlifyID
                }
            }
        `
        export const getAccountByNetlifyID = `
            query ($netlifyID: ID!) {
                getAccountByNetlifyID(netlifyID: $netlifyID) {
                    _id
                    stripeID
                }
            }
        `
        export const getAccountByStripeID = `
            query ($stripeID: ID!) {
                getAccountByNetlifyID(stripeID: $stripeID) {
                    netlifyID
                }
            }
        `
        export const getProfileByNetlifyID = `
            query ($netlifyID: ID!) {
                getProfileByNetlifyID(netlifyID: $netlifyID) {
                    _id
                    username
                    name
                    body
                    profileImage
                    website
                    twitter
                    facebook
                    github
                    instagram
                    categories {
                        data {
                            _id
                            label
                            value
                        }
                    }
                    products {
                        data {
                            _id
                            uuid
                            title
                            body
                            description
                            interval
                            price
                            status
                            hashtags {
                                data {
                                    _id
                                    label
                                    value
                                }
                            }
                        }
                    }
                }
            }
        `
        export const allProducts = `
            query {
                allProducts {
                    data {
                        _id
                        uuid
                        title
                        description
                        body
                        status
                        price
                        interval
                        hashtags {
                            data {
                                _id
                                label
                                value
                            }
                        }
                        author {
                            _id
                            username
                            name
                            body
                            profileImage
                            website
                            twitter
                            facebook
                            github
                            instagram
                            categories {
                                data {
                                    _id
                                    label
                                    value
                                }
                            }
                            products {
                                data {
                                    _id
                                    uuid
                                    title
                                    body
                                    description
                                    interval
                                    price
                                    status
                                    hashtags {
                                        data {
                                            _id
                                            label
                                            value
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `
        export const getProductByStripeID = `
            query ($stripeID: ID!) {
                getProductByStripeID(stripeID: $stripeID) {
                    _id
                    uuid
                    netlifyID
                    stripeID
                    title
                    description
                    body
                    status
                    price
                    interval
                    hashtags {
                        data {
                            _id
                            label
                            value
                        }
                    }
                    author {
                        _id
                        username
                        name
                        body
                        profileImage
                        website
                        twitter
                        facebook
                        github
                        instagram
                        categories {
                            data {
                                _id
                                label
                                value
                            }
                        }
                    }
                }
            }
        `
        export const getProductByUuid = `
            query ($uuid: ID!) {
                getProductByUuid(uuid: $uuid) {
                    _id
                    uuid
                    netlifyID
                    stripeID
                    title
                    description
                    body
                    status
                    price
                    interval
                    hashtags {
                        data {
                            _id
                            label
                            value
                        }
                    }
                    author {
                        _id
                        username
                        name
                        body
                        profileImage
                        website
                        twitter
                        facebook
                        github
                        instagram
                        categories {
                            data {
                                _id
                                label
                                value
                            }
                        }
                    }
                }
            }
        `
        export const getPaymentByChargeStripeID = `
            query ($chargeStripeID: ID!) {
                getPaymentByChargeStripeID(chargeStripeID: $chargeStripeID) {
                    _id
                    chargeStripeID
                }
            }

        `
    }
    export namespace Mutation {
        export const createCustomer = `
            mutation ($netlifyID: ID!, $stripeID: ID!) {
                createCustomer(data: { netlifyID: $netlifyID, stripeID: $stripeID }) {
                    netlifyID
                    stripeID
                }
            }
        `
        export const createAccount = `
            mutation ($netlifyID: ID!, $stripeID: ID!) {
                createAccount(data: { netlifyID: $netlifyID, stripeID: $stripeID }) {
                    netlifyID
                    stripeID
                }
            }

        `
        export const createProfile = `
            mutation ($netlifyID: ID!, $username: String!, $name: String!, $body: String!, $website: String, $twitter: String, $facebook: String, $instagram: String, $github: String, $profileImage: String, $categories: [ID]!) {
                createProfile(data: {
                    netlifyID: $netlifyID,
                    username: $username,
                    name: $name,
                    body: $body,
                    website: $website,
                    twitter: $twitter,
                    facebook: $facebook,
                    instagram: $instagram,
                    github: $github,
                    profileImage: $profileImage,
                    categories: {
                        connect: $categories
                    }
                 }) {
                    _id
                    username
                    name
                    body
                    profileImage
                    website
                    twitter
                    facebook
                    instagram
                    github
                    categories {
                        data {
                            _id
                            label
                            value
                        }
                    }
                    products {
                        data {
                            _id
                            uuid
                            title
                            body
                            description
                            interval
                            price
                            status
                            hashtags {
                                data {
                                    _id
                                    label
                                    value
                                }
                            }
                        }
                    }
                }
            }
        `
        export const updateProfile = `
            mutation ($id: ID!, $netlifyID: ID!, $username: String!, $name: String!, $body: String!, $website: String, $twitter: String, $facebook: String, $instagram: String, $github: String, $profileImage: String, $connect: [ID]!, $disconnect: [ID]!) {
                updateProfile(id: $id, data: {
                    netlifyID: $netlifyID,
                    username: $username,
                    name: $name,
                    body: $body,
                    website: $website,
                    twitter: $twitter,
                    facebook: $facebook,
                    instagram: $instagram,
                    github: $github,
                    profileImage: $profileImage,
                    categories: {
                        connect: $connect
                        disconnect: $disconnect
                    }
                 }) {
                    _id
                    username
                    name
                    body
                    profileImage
                    website
                    twitter
                    facebook
                    instagram
                    github
                    categories {
                        data {
                            _id
                            label
                            value
                        }
                    }
                    products {
                        data {
                            _id
                            uuid
                            title
                            body
                            description
                            interval
                            price
                            status
                            hashtags {
                                data {
                                    _id
                                    label
                                    value
                                }
                            }
                        }
                    }
                }
            }
        `
        export const createProduct = `
            mutation (
                $uuid: ID!,
                $netlifyID: ID!,
                $title: String!,
                $description: String!,
                $body: String!,
                $status: String!,
                $price: Int!,
                $interval: String!,
                $hashtags: [ID]!,
                $author: ID!
            ) {
                createProduct(data: {
                    uuid: $uuid,
                    netlifyID: $netlifyID,
                    title: $title,
                    description: $description,
                    body: $body,
                    status: $status,
                    price: $price,
                    interval: $interval,
                    hashtags: {
                        connect: $hashtags
                    },
                    author: {
                        connect: $author
                    }
                 }) {
                    _id
                    uuid
                    title
                    description
                    body
                    status
                    price
                    interval
                    hashtags {
                        data {
                            _id
                            label
                            value
                        }
                    }
                }
            }
        `
        export const updateProduct = `
            mutation (
                $id: ID!,
                $uuid: ID!,
                $netlifyID: ID!,
                $stripeID: ID,
                $title: String!,
                $description: String!,
                $body: String!,
                $status: String!,
                $price: Int!,
                $interval: String!,
                $connect: [ID]!,
                $disconnect: [ID]!,
                $author: ID!
            ) {
                updateProduct(id: $id, data: {
                    uuid: $uuid,
                    netlifyID: $netlifyID,
                    stripeID: $stripeID,
                    title: $title,
                    description: $description,
                    body: $body,
                    status: $status,
                    price: $price,
                    interval: $interval,
                    hashtags: {
                        connect: $connect
                        disconnect: $disconnect
                    },
                    author: {
                        connect: $author
                    }
                 }) {
                    _id
                    uuid
                    title
                    description
                    body
                    status
                    price
                    interval
                    hashtags {
                        data {
                            _id
                            label
                            value
                        }
                    }
                }
            }
        `
        export const createPayment = `
            mutation (
                $accountNetlifyID: ID!,
                $customerStripeID: ID!,
                $product: ID!,
                $chargeStripeID: ID!,
                $productName: String!,
                $chargePrice: Int!
                $salesPrice: Int!
                $fee: Int!
                $feePercentage: Int!
            ) {
                createPayment(data: {
                    accountNetlifyID: $accountNetlifyID,
                    customerStripeID: $customerStripeID,
                    product: { connect: $product },
                    chargeStripeID: $chargeStripeID,
                    productName: $productName,
                    chargePrice: $chargePrice,
                    salesPrice: $salesPrice,
                    fee: $fee,
                    feePercentage: $feePercentage
                }){
                    _id
                    chargeStripeID
                }
            }
        `
    }
}

export interface Context {
    query: string;
    variables: {
        [k: string]: any;
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