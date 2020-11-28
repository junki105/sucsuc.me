import { Profile } from './Profile'
import { Hashtag } from './Hashtag'

export const INTERVAL_MONTHLY = "monthly"
export const INTERVAL_CHARGE = "charge"

export const STATUS_ACTIVE = "Active"
export const STATUS_HIDDEN = "Hidden"

export const intervalOptions = [
    { label: "月額", value: INTERVAL_MONTHLY },
    { label: "単発", value: INTERVAL_CHARGE }
]
export const statusOptions = [
    { label: "表示", value: STATUS_ACTIVE },
    { label: "非表示", value: STATUS_HIDDEN }
]


export interface Product {
    _id?: Number;
    uuid?: String;
    stripeID?: String;
    title: String;
    description: String;
    body: String;
    status: String;
    price: number;
    interval: String;
    hashtags: Hashtag[] | Number[];
    author: Profile;

    copy?: boolean;
}

export function createProduct(data: any = {}): Product {
    return {
        ...data,
        title: "",
        description: "",
        body: "",
        price: 1000,
        interval: INTERVAL_MONTHLY,
        hashtags: [],
        status: STATUS_ACTIVE,
    }
}

export function convertProduct(data: any): Product {
    return {
        ...data,
        hashtags: data.hashtags.data as Hashtag[]
    }
}