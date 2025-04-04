import { getDataFromFirebase } from "@/lib/firebaseFunction";


export const loadEssentiaData = async () => {
    try {
        const userId = sessionStorage.getItem('user');
        const [purchases, products, customers, vendors, sales] = await Promise.all([
            getDataFromFirebase("purchase", userId),
            getDataFromFirebase("product", userId),
            getDataFromFirebase("customer", userId),
            getDataFromFirebase("vendor", userId),
            getDataFromFirebase("sale", userId)
        ]);
        return { purchases, products, customers, vendors, sales };
    } catch (error) {
        console.log(error);
    }
}