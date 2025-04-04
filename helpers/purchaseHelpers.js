import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { numberWithCommaISO, sortArray } from "@/lib/utils";


const load = async () => {
    try {
        const userId = sessionStorage.getItem('user');
        const [purchases, products, vendors, sales] = await Promise.all([
            getDataFromFirebase("purchase", userId),
            getDataFromFirebase("product", userId),
            getDataFromFirebase("vendor", userId),
            getDataFromFirebase("sale", userId)

        ]);
        return { purchases, products, vendors, sales };
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}





export const purchaseHelpers = async () => {
    const { purchases, products, vendors, sales } = await load();

    const joinCollection = purchases.map(purchase => {
        const matchPurchase = sales.find(sale => sale.purchaseId === purchase.id);
        const matchProduct = products.find(product => product.id === purchase.productId);
        const matchVendor = vendors.find(vendor => vendor.id === purchase.vendorId);
        const subTotal = parseFloat(purchase.qty) * parseFloat(purchase.purchasePrice);
        return {
            ...purchase,
            isUpdatable: matchPurchase ? false : true,
            product: matchProduct.name,
            vendor: matchVendor.name,
            subTotal: subTotal.toFixed(2)
        }
    });
    const sortedData = joinCollection.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
    return sortedData;
}