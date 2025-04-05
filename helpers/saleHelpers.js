import { sortArray, unique } from "@/lib/utils";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { purchaseSimplify } from "./purchaseHelpers";




export const saleSimplify = async () => {
    try {
        const userId = sessionStorage.getItem('user');
        const [sales, purchases, customers] = await Promise.all([
            getDataFromFirebase("sale", userId),
            purchaseSimplify(),
            getDataFromFirebase("customer", userId)
        ]);

        const result = sales.map(sale => {
            const matchPurchase = purchases.find(purchase => purchase.id === sale.purchaseId);
            const matchCustomer = customers.find(customer => customer.id === sale.customerId);
            return { ...sale, matchPurchase, matchCustomer }
        })
        return result;
    } catch (error) {
        console.log(error);
    }
}


export const saleHelpers = async () => {
    const data = await saleSimplify();

    const saleInvoice = data.map(item => item.invoice);
    const uniqueInvoices = unique(saleInvoice);


    const result = uniqueInvoices.map(invoice => {
        const matchSale = data.filter(sale => sale.invoice === invoice);
        const saleAmount = matchSale.reduce((t, c) => t + (parseFloat(c.qty) * parseFloat(c.matchPurchase.salePrice)), 0);

        const totalPayment = matchSale.reduce((t, c) => t + parseFloat(c.payment), 0);
        const totalDeduct = matchSale.reduce((t, c) => t + parseFloat(c.deduct), 0);
        const taxAmount = matchSale.reduce((t, c) => t + (saleAmount * (parseFloat(c.tax) / 100)), 0);
        const balance = saleAmount + taxAmount - totalPayment - totalDeduct;

        return {
            invoice,
            uniqueInvoices,
            customer: matchSale[0].matchCustomer.name,
            dt: matchSale[0].dt,
            saleAmount,
            totalPayment,
            totalDeduct,
            taxAmount,
            balance
        }
    })
    const sortedData = result.sort((a, b) => sortArray(parseInt(b.invoice), parseInt(a.invoice)));
    return sortedData;
}





const load = async () => {
    try {
        const userId = sessionStorage.getItem('user');
        const [purchases, customers, vendors, products, sales] = await Promise.all([
            getDataFromFirebase("purchase", userId),
            getDataFromFirebase("customer", userId),
            getDataFromFirebase("vendor", userId),
            getDataFromFirebase("product", userId),
            getDataFromFirebase("sale", userId)
        ]);
        return { purchases, customers, vendors, products, sales };
    } catch (error) {
        console.log(error);
    }
}




//----------------For Add & AddItem page ------------------

export const stockBalance = async () => {
    const { purchases, customers, vendors, products, sales } = await load();

    const result = purchases.map(purchase => {
        const matchProduct = products.find(product => product.id === purchase.productId);
        const matchVendor = vendors.find(vendor => vendor.id === purchase.vendorId);

        const matchSale = sales.filter(sale => sale.purchaseId === purchase.id);
        const totaSale = matchSale.reduce((t, c) => t + parseFloat(c.qty), 0);
        const stock = parseFloat(purchase.qty) - totaSale;

        return {
            ...purchase,
            product: matchProduct.name,
            stock: stock,
            vendor: matchVendor.name
        }
    })

    const withOutZeroStock = result.filter(item => item.stock > 0);
    return { purchaseData: withOutZeroStock, customers, products, vendors };
}



//---------------For Creating Invoice -------------------------


export const getDataForInvoice = async (invoice) => {
    try {
        const data = await saleSimplify();
        const result = data.filter(sale => sale.invoice === invoice)
        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}


