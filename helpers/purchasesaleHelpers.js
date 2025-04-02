import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";



const load = async () => {
    try {
        const userId = sessionStorage.getItem('user');
        const [purchases, products, vendors, customers, sales] = await Promise.all([
            getDataFromFirebase("purchase",userId),
            getDataFromFirebase("product",userId),
            getDataFromFirebase("vendor",userId),
            getDataFromFirebase("customer",userId),
            getDataFromFirebase("sale",userId)
        ]);

        return { purchases, products, vendors, customers, sales };
    } catch (error) {
        console.log(error);
    }
}





export const purchaseHelper = async (dt1, dt2) => {
    const { purchases, products, vendors } = await load();
    const d1 = new Date(dt1);
    const d2 = new Date(dt2);

    const joinPurchase = purchases.map(purchase => {
        const matchProduct = products.find(product => product.id === purchase.productId);
        const matchVendor = vendors.find(vendor => vendor.id === purchase.vendorId);
        const sTotal = parseFloat(purchase.unit) * parseFloat(purchase.cost);
        return {
            ...purchase,
            product: matchProduct.name,
            vendor: matchVendor.name,
            subTotal: sTotal.toFixed(2)
        }
    });
    const sortedPurchase = joinPurchase.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
    const filterData = sortedPurchase.filter(purchase => {
        const purchaseDate = new Date(purchase.dt);
        return purchaseDate >= d1 && purchaseDate <= d2;
    })

    const total = filterData.reduce((t, c) => t + parseFloat(c.subTotal), 0).toFixed(2);
    return { data: filterData, total: total };
}





export const salesHelper = async (dt1, dt2) => {
    const { purchases, products, customers, sales } = await load();
    const d1 = new Date(dt1);
    const d2 = new Date(dt2);

    const joinSale = sales.map(sale => {

        const matchPurchase = purchases.find(purchase => purchase.id === sale.purchaseId);
        const matchCustomer = customers.find(customer => customer.id === sale.customerId);
        const matchProduct = products.find(product => product.id === matchPurchase.productId);

        const sTotal = (parseFloat(sale.unit) * parseFloat(matchPurchase.cost)) - parseFloat(sale.deduct);
        return {
            ...sale,
            subTotal: sTotal.toFixed(2),
            cost: matchPurchase.cost,
            product: matchProduct.name,
            customer: matchCustomer.name
        }
    });
    const sortedSale = joinSale.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));

    const filterData = sortedSale.filter(sale => {
        const saleDate = new Date(sale.dt);
        return saleDate >= d1 && saleDate <= d2;
    })
    const total = filterData.reduce((t, c) => t + parseFloat(c.subTotal), 0).toFixed(2);
    return { data: filterData, total: total };
} 