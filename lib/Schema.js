// str.toString() ; Number(str) || 0 ; true/fale

export const customerSchema = (data = []) => {
    if (!Array.isArray(data) || data.length < 4) {
        throw new Error("Data array of at least 4 elements");
    }
    const [name, businessName, address, mobile] = data;
    return {
        name: name.toString(),
        businessName: businessName.toString(),
        address: address.toString(),
        mobile: mobile.toString(),
        createdAt: new Date().toISOString()
    }
}




export const productSchema = (data = []) => {
    if (!Array.isArray(data) || data.length < 2) {
        throw new Error("Data array of at least 2 elements");
    }
    const [name, description] = data;
    return {
        name: name.toString(),
        description: description.toString(),
        createdAt: new Date().toISOString()
    }
}



export const vendorSchema = (data = []) => {
    if (!Array.isArray(data) || data.length < 4) {
        throw new Error("Data array of at least 4 elements");
    }
    const [name, businessName, address, mobile] = data;
    return {
        name: name.toString(),
        businessName: businessName.toString(),
        address: address.toString(),
        mobile: mobile.toString(),
        createdAt: new Date().toISOString()
    }
}



export const purchaseSchema = (data = []) => {
    if (!Array.isArray(data) || data.length < 8) {
        throw new Error("Data array of at least 8 elements");
    }

    const [dt, shipment, vendorId,  productId, shadeNo, qty, price, yr] = data;
    return {
        dt: dt.toString(),
        shipment: shipment.toString(),
        vendorId: vendorId.toString(),
        productId: productId.toString(),
        shadeNo: shadeNo.toString(),
        qty: Number(qty),
        price: Number(price),
        yr: Number(yr),
        createdAt: new Date().toISOString()
    }
}





export const saleSchema = (data = []) => {
    if (!Array.isArray(data) || data.length < 7) {
        throw new Error("Data array of at least 7 elements");
    }
    const [dt, customerId,  productId, shadeNo, qty, price, yr] = data;
    return {
        dt: dt.toString(),
        customerId: customerId.toString(),
        productId: productId.toString(),
        shadeNo: shadeNo.toString(),
        qty: Number(qty),
        price: Number(price),
        yr: Number(yr),
        createdAt: new Date().toISOString()
    }
}





export const moneyreceiptSchema = (data = []) => {
    if (!Array.isArray(data) || data.length < 11) {
        throw new Error("Data array of at least 10 elements");
    }
    const [refNo, dt, whom, amount, cash, cheque, bank, bankDt, purpose, contact, userId] = data;
    return {
        refNo: refNo.toString(),
        dt: dt.toString(),
        whom: whom.toString(),
        amount: Number(amount),
        cash: cash.toString(),
        cheque: cheque.toString(),
        bank: bank.toString(),
        bankDt: bankDt.toString(),
        purpose: purpose.toString(),
        contact: contact.toString(),
        userId: userId.toString(),
        createdAt: new Date().toISOString()
    }
}





export const paymentSchema = (data = []) => {
    if (!Array.isArray(data) || data.length < 10) {
        throw new Error("Data array of at least 10 elements");
    }
    const [refNo, customerId, dt, cashType, bank, chequeNo, chequeDt, purpose, amount, userId] = data;
    return {
        refNo: refNo.toString(),
        customerId: customerId.toString(),
        dt: dt.toString(),
        cashType: cashType.toString(),
        bank: bank.toString(),
        chequeNo: chequeNo.toString(),
        chequeDt: chequeDt.toString(),
        purpose: purpose.toString(),
        amount: Number(amount),
        userId: userId.toString(),
        createdAt: new Date().toISOString()
    }
}




export const iplocationSchema = (data = []) => {
    if (!Array.isArray(data) || data.length < 1) {
        throw new Error("Data array of at least 1 elements");
    }
    const [address] = data;
    return{
        address: address.toString(),
        createdAt: new Date().toISOString()
    }
}       