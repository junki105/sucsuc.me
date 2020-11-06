export namespace StripeConst {
  export namespace Currency {
      export const JPY = 'jpy';
      export const HKD = 'hkd';
  }
  export namespace Country {
    export const JP = 'jp';
    export const HK = 'hk';
  }
  export namespace Interval {
    export const MONTHLY = 'monthly';
  }
}

export function formatAmountForDisplay(
  amount: number,
  currency: string
): string {
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  return numberFormat.format(amount)
}

export function formatAmountForStripe(
  amount: number,
  currency: string
): number {
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency: boolean = true
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}
