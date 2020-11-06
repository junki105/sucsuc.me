export interface ChargeList {
    hasMore: boolean;
    data: Charge[];
}

export interface Charge {
    id: String;
    amount: Number;
    receiptUrl: String|null;
    paid: boolean;
    created: Number;
}

