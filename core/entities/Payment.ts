export const APP_FEE_PERCENTAGE = 8


export interface Payment {
    _id?: Number;
}

export function calculateSalesPrice(price: number): number {
    return price - calculateFee(price)
}

export function calculateFee(price: number): number {
    return Math.floor(price * (APP_FEE_PERCENTAGE / 100))
}