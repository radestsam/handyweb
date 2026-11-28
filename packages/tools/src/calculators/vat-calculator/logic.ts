export interface VatSplit {
    net: number;
    vat: number;
    gross: number;
}

/** A price without VAT, plus VAT at the rate. */
export function addVat(net: number, rate: number): VatSplit {
    const vat = (net * rate) / 100;
    return { net, vat, gross: net + vat };
}

/** A price that includes VAT, split into the price without VAT and the VAT. */
export function removeVat(gross: number, rate: number): VatSplit {
    const net = gross / (1 + rate / 100);
    return { net, vat: gross - net, gross };
}
