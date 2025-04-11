// str.toString() ; Number(str) || 0 ; true/fale
export const customerSchema = (data = []) => {
    if (!Array.isArray(data) || data.length < 5) {
        throw new Error("Data array of at least 5 elements");
    }
    const [name, email, address, phone, userId] = data;
    return {
        name: name.toString(),
        email: email.toString(),
        address: address.toString(),
        phone: phone.toString(),
        userId: userId.toString(),
        createdAt: new Date().toISOString()
    }
}




export const productSchema = (data = []) => {
    if (!Array.isArray(data) || data.length < 3) {
        throw new Error("Data array of at least 3 elements");
    }
    const [name, description, userId] = data;
    return {
        name: name.toString(),
        description: description.toString(),
        userId: userId.toString(),
        createdAt: new Date().toISOString()
    }
}



export const vendorSchema = (data = []) => {
    if (!Array.isArray(data) || data.length < 5) {
        throw new Error("Data array of at least 5 elements");
    }
    const [name, email, address, phone, userId] = data;
    return {
        name: name.toString(),
        email: email.toString(),
        address: address.toString(),
        phone: phone.toString(),
        userId: userId.toString(),
        createdAt: new Date().toISOString()
    }
}



export const purchaseSchema = (data = []) => {
    if (!Array.isArray(data) || data.length < 8) {
        throw new Error("Data array of at least 8 elements");
    }
    const [productId, vendorId, dt, qty, purchasePrice, salePrice, tax, userId] = data;
    return {
        productId: productId.toString(),
        vendorId: vendorId.toString(),
        dt: dt.toString(),
        qty: Number(qty),
        purchasePrice: Number(purchasePrice),
        salePrice: Number(salePrice),
        tax: Number(tax),
        userId: userId.toString(),
        createdAt: new Date().toISOString()
    }
}





export const saleSchema = (data = []) => {
    if (!Array.isArray(data) || data.length < 8) {
        throw new Error("Data array of at least 8 elements");
    }
    const [invoice, dt, customerId, payment, deduct, userId, purchaseId, qty] = data;
    return {
        invoice: Number(invoice),
        dt: dt.toString(),
        customerId: customerId.toString(),
        payment: Number(payment),
        deduct: Number(deduct),
        userId: userId.toString(),
        purchaseId: purchaseId.toString(),
        qty: Number(qty),
        createdAt: new Date().toISOString()
    }
}       
