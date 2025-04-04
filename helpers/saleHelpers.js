import { sortArray, unique } from "@/lib/utils";
import { loadEssentiaData } from "./loadEssentiaData";



const simplifyData = async () => {
    try {
        const { purchases, customers, sales } = await loadEssentiaData();
        const saleInvoice = sales.map(sale => sale.invoice);
        const uniqueInvoice = unique(saleInvoice);

        const data = sales.map(sale => {
            const matchPurchase = purchases.find(purchase => purchase.id === sale.purchaseId);
            const matchCustomer = customers.find(customer => customer.id === sale.customerId);
            return {
                ...sale,
                customer: matchCustomer.name,
                salePrice: matchPurchase.salePrice
            }
        });
        return { data, uniqueInvoice };
    } catch (error) {
        console.error(error);
    }
}


export const saleHelp = async () => {
    const { data, uniqueInvoice } = await simplifyData();
    // console.log({ data, uniqueInvoice });
    const result = uniqueInvoice.map(invoice => {
        const matchSale = data.filter(sale => sale.invoice === invoice);
        const salePrice = matchSale.reduce((t, c) => t + (parseFloat(c.qty) * parseFloat(c.salePrice)), 0);
        const totalPayment = matchSale.reduce((t, c) => t + parseFloat(c.payment), 0);
        const totalDeduct = matchSale.reduce((t, c) => t + parseFloat(c.deduct), 0);
        const paymentDues = salePrice - totalPayment - totalDeduct;
        const ids = matchSale.map(sale => sale.id); // get ids in array
        return {
            salePrice,
            totalPayment,
            totalDeduct,
            paymentDues,
            customer: matchSale[0].customer,
            dt: matchSale[0].dt,
            invoice: matchSale[0].invoice,
            ids
        }
    })
    const sortedData = result.sort((a, b) => sortArray(parseInt(b.invoice), parseInt(a.invoice)));
    return sortedData;
}


//------------------------------------------------------------


export const getDataForInvoice = async (invoice) => {
    try {
        const { purchases, products, customers, vendors, sales } = await loadEssentiaData();
        const saleByInvoice = sales.filter(sale => sale.invoice === invoice);
        const result = saleByInvoice.map(sale => {
            const matchPurchase = purchases.find(purchase => purchase.id === sale.purchaseId);
            const matchProduct = products.find(product => product.id === matchPurchase.productId);
            const matchCustomer = customers.find(customer => customer.id === sale.customerId);
            const matchVendor = vendors.find(vendor => vendor.id === matchPurchase.vendorId);
            return {
                ...sale, matchPurchase, matchProduct, matchCustomer, matchVendor
            }
        })

        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}


