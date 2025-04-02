
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";


const load = async () => {
    try {
        const userId = sessionStorage.getItem('user');
        const [purchase, product, vendor, customer, sale] = await Promise.all([
            getDataFromFirebase("purchase", userId),
            getDataFromFirebase("product", userId),
            getDataFromFirebase("vendor", userId),
            getDataFromFirebase("customer", userId),
            getDataFromFirebase("sale", userId)
        ]);

        return { purchase, product, vendor, customer, sale }
    } catch (error) {
        console.log(error);
    }
}


export const productStock = async () => {
    const data = await load();
    const purchases = data.purchase;
    const products = data.product;
    const vendors = data.vendor;
    const sales = data.sale;

    const joinCollection = purchases.map(purchase => {
        const matchSale = sales.filter(sale => sale.purchaseId === purchase.id);
        const totalSale = matchSale.reduce((t, c) => t + parseFloat(c.unit), 0);
        //-----------------------
        const stock = parseFloat(purchase.unit) - totalSale;
        return {
            ...purchase,
            stock: stock,
            product: products.find(product => product.id === purchase.productId) || {},
            vendor: vendors.find(vendor => vendor.id === purchase.vendorId) || {}
        }
    });
    // If stock is zero not shwing ui
    const noZeroData = joinCollection.filter(data => parseFloat(data.stock) > 0);
    const sortedData = noZeroData.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
    return sortedData;
}





export const salesData = async () => {
    const data = await load();
    const purchases = data.purchase;
    const products = data.product;
    const vendors = data.vendor;
    const customers = data.customer;
    const sales = data.sale;
    //-----------------------
    const joinSaleCollection = sales.map(sale => {
        const matchPurchase = purchases.find(purchase => purchase.id === sale.purchaseId);
        const matchProduct = products.find(product => product.id === matchPurchase.productId);
        const matchVendor = vendors.find(vendor => vendor.id === matchPurchase.vendorId);
        const matchCustomer = customers.find(customer => customer.id === sale.customerId);
        return {
            ...sale,
            product: matchProduct || {},
            vendor: matchVendor || {},
            customer: matchCustomer || {}
        }
    });
    const sorteSaledData = joinSaleCollection.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
    return sorteSaledData;
}

