import { sortArray, unique } from "@/lib/utils";
import { getDataFromFirebase } from "@/lib/firebaseFunction";


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


//------------ For Index page----------------------------
const joinDataAndUniqueInvoice = async () => {
    try {
        const { purchases, customers, sales } = await load();
        // Unique invoice number
        const saleInvoice = sales.map(sale => sale.invoice);
        const uniqueInvoice = unique(saleInvoice);

        // join purchase and customer collections
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
    const { data, uniqueInvoice } = await joinDataAndUniqueInvoice();

    const result = uniqueInvoice.map(invoice => {
        const matchSale = data.filter(sale => sale.invoice === invoice);

        const totalSalePrice = matchSale.reduce((t, c) => t + (parseFloat(c.qty) * parseFloat(c.salePrice)), 0);
        const totalTax = matchSale.reduce((t, c) => t + parseFloat(c.tax), 0);

        const totalSalePriceWithTax = totalSalePrice + (totalSalePrice * parseFloat((totalTax / 100)));
        const totalPayment = matchSale.reduce((t, c) => t + parseFloat(c.payment), 0);
        const totalDeduct = matchSale.reduce((t, c) => t + parseFloat(c.deduct), 0);
        const paymentDues = totalSalePriceWithTax - totalPayment - totalDeduct;

        const ids = matchSale.map(sale => sale.id); // get ids in array
        return {
            totalSalePriceWithTax,
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


//----------------For Add & AddItem page ------------------

export const stockBalance = async () => {
    const { purchases, products, vendors, sales } = await load();

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
    return withOutZeroStock;
}


//---------------For Creating Invoice -------------------------


export const getDataForInvoice = async (invoice) => {
    try {
        const { purchases, customers, vendors, products, sales } = await load();

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


