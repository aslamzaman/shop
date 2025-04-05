import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";


export const purchaseSimplify = async () => {
    try {
        const userId = sessionStorage.getItem('user');
        const [purchases, products, vendors] = await Promise.all([
            getDataFromFirebase("purchase", userId),
            getDataFromFirebase("product", userId),
            getDataFromFirebase("vendor", userId)
        ]);
        const result = purchases.map(purchase => {
            const matchProduct = products.find(product => product.id === purchase.productId);
            const matchVendor = vendors.find(vendor => vendor.id === purchase.vendorId);
            return {
                ...purchase, matchProduct, matchVendor
            }
        })
        const data = result.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


export const purchaseData = async () => {
    const userId = sessionStorage.getItem('user');
    const [purchases, sales] = await Promise.all([
        purchaseSimplify(),
        getDataFromFirebase("sale", userId)
    ]);
    const result = purchases.map(purchase => {
        const matchSale = sales.filter(sale => sale.purchaseId === purchase.id);

        const subTotal = parseFloat(purchase.qty) * parseFloat(purchase.purchasePrice);

        return {
            ...purchase,
            isUpdatable: matchSale.length > 0 ? false : true,
            product: purchase.matchProduct.name,
            vendor: purchase.matchVendor.name,
            subTotal: subTotal.toFixed(2)
        }
    });
    const data = result.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
    return data;
}
