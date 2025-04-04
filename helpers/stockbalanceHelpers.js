import { loadEssentiaData } from "./loadEssentiaData";

export const stockBalance = async (dt1, dt2) => {
    const d1 = new Date(dt1);
    const d2 = new Date(dt2);

    const { purchases, products, vendors, sales } = await loadEssentiaData();

    const result = purchases.map(purchase => {
        const matchProduct = products.find(product => product.id === purchase.productId);
        const matchVendor = vendors.find(vendor => vendor.id === purchase.vendorId);
        const matchSale = sales.filter(sale => sale.purchaseId === purchase.id);
        const totaSale = matchSale.reduce((t, c) => t + parseFloat(c.qty), 0);
        const stock = parseFloat(purchase.qty) - totaSale;
        const stockAmount = stock * parseFloat(purchase.purchasePrice);

        return {
            ...purchase,
            product: matchProduct.name,
            sale: totaSale,
            stock: stock,
            stockAmount: stockAmount,
            vendor: matchVendor.name

        }
    })

    const filterData = result.filter(purchase => {
        const purchaseDate = new Date(purchase.dt);
        return purchaseDate >= d1 && purchaseDate <= d2;
    })

    const withOutZeroStock = filterData.filter(item => item.stock > 0);

    const gt = withOutZeroStock.reduce((t, c) => t + parseFloat(c.stockAmount), 0);
    return { result: withOutZeroStock, gt };
}




