"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/sale/Add";
import { jsPDF } from "jspdf";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { formatedDate, numberWithCommaISO, sortArray } from "@/lib/utils";


const getSale = async () => {
    const userId = sessionStorage.getItem('user');
    const [purchaseResponse, saleResponse, customerResponse] = await Promise.all([
        getDataFromFirebase("purchase", userId),
        getDataFromFirebase("sale", userId),
        getDataFromFirebase("customer", userId)
    ]);
    const join = saleResponse.map(sale => {
        const matchPurchase = purchaseResponse.find(p => p.id === sale.purchaseId);
        const matchCustomer = customerResponse.find(c => c.id === sale.customerId);
        return {
            ...sale,
            matchPurchase,
            customer: matchCustomer ? matchCustomer.name : ''
        }
    })


    // -------- Unique invoice -----------------
    const saleInvoice = join.map(item => item.invoice);
    const uniqueInvoices = [...new Set(saleInvoice)];


    // -------- Get sales in group -----------------
    const result = uniqueInvoices.map(invoice => {
        const matchSale = join.filter(s => s.invoice === invoice);
        const totalSale = matchSale.reduce((t, c) => t + (c.qty * c.matchPurchase.salePrice), 0);
        const totalTax = matchSale.reduce((t, c) => t + ((c.qty * c.matchPurchase.salePrice) * (c.matchPurchase.tax / 100)), 0);
        const totalPayment = matchSale.reduce((t, c) => t + c.payment, 0);
        const totalDeduct = matchSale.reduce((t, c) => t + c.deduct, 0);
        const balance = totalSale + totalTax - totalPayment - totalDeduct;
        return {
            invoice,
            customer: matchSale[0].customer,
            totalSale,
            totalTax,
            totalPayment,
            totalDeduct,
            balance,
            dt: matchSale[0].dt
        }
    })
    const sortedData = result.sort((a, b) => sortArray(Number(b.invoice), Number(a.invoice)));
    return sortedData;
}



const Invoice = () => {
    const [sales, setSales] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const newData = await getSale();
                console.log({ newData });
                setSales(newData);
                setWaitMsg('');
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getData();
    }, [msg]);


    const messageHandler = (data) => {
        setMsg(data);
    }



    const printHandler = async (invoiceNumber) => {
        try {
            const userId = sessionStorage.getItem('user');
            const [purchaseResponse, saleResponse, customerResponse, productResponse] = await Promise.all([
                getDataFromFirebase("purchase", userId),
                getDataFromFirebase("sale", userId),
                getDataFromFirebase("customer", userId),
                getDataFromFirebase("product", userId)
            ]);
            const join = saleResponse.map(sale => {
                const matchPurchase = purchaseResponse.find(p => p.id === sale.purchaseId);
                const matchCustomer = customerResponse.find(c => c.id === sale.customerId);
                const matchProduct = productResponse.find(p => p.id === matchPurchase.productId);
                return {
                    ...sale,
                    matchPurchase,
                    matchCustomer,
                    matchProduct
                }
            })
            const data = join.filter(sale => sale.invoice === invoiceNumber);
            console.log(data);
            //------------------------------------------------------------------------

            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
                putOnlyUsedFonts: true,
                floatPrecision: 16 // or "smart", default is 16
            });

            doc.setFont("times", "bold");
            doc.setFontSize(20);
            doc.text("INVOICE", 105, 55, { align: "center" });
            doc.setFontSize(11);
            doc.setDrawColor("#999999");

            doc.text("Bill To: ", 25, 75, { align: "left" });
            doc.text(`${data[0].matchCustomer.name}`, 40, 75, { align: "left" });
            doc.setFont("times", "normal");
            doc.text(`${data[0].matchCustomer.address}`, 40, 80, { align: "left" });
            doc.text(`${data[0].matchCustomer.email}`, 40, 85, { align: "left" });
            doc.text(`${data[0].matchCustomer.phone}`, 40, 90, { align: "left" });

            doc.text(`Invoice Number: ${invoiceNumber}`, 183, 75, { align: "right" });
            doc.text(`Invoice Date: ${formatedDate(data[0].dt)}`, 183, 80, { align: "right" });
            doc.text(`Print Date: ${formatedDate(new Date())}`, 183, 85, { align: "right" });
            //----------------- Header ----------------------------
            doc.setFont("times", "bold");
            doc.text("Product Name", 27, 110, { align: "left" });
            doc.text("Unit Price", 106, 110, { align: "right" });
            doc.text("Quantity", 125, 110, { align: "right" });
            doc.text("Tax", 154, 110, { align: "right" });
            doc.text("Total", 183, 110, { align: "right" });
            doc.line(25, 112, 185, 112);
            doc.setFont("times", "normal");

            //------------- Loop ------------------------

            let y = 117;
            let subTotal = 0;
            for (let i = 0; i < data.length; i++) {

                const product = data[i].matchProduct.name;
                const price = data[i].matchPurchase.salePrice;
                const tax = data[i].matchPurchase.tax;
                const qty = data[i].qty;
                const total = (price + (price * (tax / 100))) * qty;
                const taxAmount = price * qty * (tax / 100);

                doc.text(`${product}`, 27, y, { align: "left" });
                doc.text(`${numberWithCommaISO(price)}`, 106, y, { align: "right" });
                doc.text(`${numberWithCommaISO(qty)}`, 125, y, { align: "right" });
                doc.text(`${numberWithCommaISO(taxAmount)}`, 154, y, { align: "right" });
                doc.text(`${numberWithCommaISO(total)}`, 183, y, { align: "right" });
                subTotal = subTotal + total;
                y = y + 5;
            }

            //------------------------------------------------------
            doc.setFont("times", "bold");
            doc.text("Sub Total", 27, y + 1, { align: "left" });
            doc.line(25, y - 3, 185, y - 3);
            doc.text(`${numberWithCommaISO(subTotal)}`, 183, y + 1, { align: "right" });
            //-----------------------------------------------------------
            const totalPayment = data.reduce((t, c) => t + c.payment, 0);
            doc.setFont("times", "normal");
            doc.text("Payment", 27, y + 8, { align: "left" });
            doc.text(`${numberWithCommaISO(totalPayment)}`, 183, y + 8, { align: "right" });

            const totalDiscount = data.reduce((t, c) => t + c.deduct, 0);
            doc.text("Discount", 27, y + 13, { align: "left" });
            doc.text(`${numberWithCommaISO(totalDiscount)}`, 183, y + 13, { align: "right" });

            //----------------------------------------------------
            const dues = subTotal - totalPayment - totalDiscount;
            doc.setFont("times", "bold");
            doc.line(25, y + 14.5, 185, y + 14.5);
            doc.text("Total Payable", 27, y + 18, { align: "left" });
            doc.text(`${numberWithCommaISO(dues)}`, 183, y + 18, { align: "right" });


            const strLen = numberWithCommaISO(dues).length * 1.9;
            const lft = 185 - (strLen + 3);
            //console.log({ strLen });
            doc.line(lft, y + 19, 185, y + 19);
            doc.line(lft, y + 19.5, 185, y + 19.5);

            //-------------------------------------------------
            doc.text("Thank You", 183, y + 55, { align: "right" });
            doc.setFont("times", "normal");
            doc.setTextColor(100, 100, 100);
            doc.text("We always need your cooperation.", 27, y + 55, { align: "left" });

            const pageHeight = doc.internal.pageSize.getHeight();
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.setFontSize(9);
            doc.text("Please contact us for feedback regarding this software: aslamcmes@gmail.com", pageWidth - 12, pageHeight - 4, { align: "right" });


            doc.save(`${new Date().toISOString()}_invoice.pdf`);
        } catch (error) {
            console.log(error);
        }
    }



    

    return (
        <>
            <div className="w-full py-4">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Invoices</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>


            <div className="w-full p-4 mt-8 border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-center border-b border-gray-200 px-4 py-1">Invoice</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Customer</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">SaleAmount</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Tax</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Payment</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Discount</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Balance/Dues</th>
                            <th className="font-normal flex justify-end border-b border-gray-200 px-4 py-1">
                                <Add message={messageHandler} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length ? (
                            sales.map(sale => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={sale.invoice}>
                                    <td className="text-center py-1 px-4">{sale.invoice}</td>
                                    <td className="text-start py-1 px-4">{sale.customer}</td>
                                    <td className="text-center py-1 px-4">{formatedDate(sale.dt)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.totalSale)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.totalTax)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.totalPayment)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.totalDeduct)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.balance)}</td>
                                    <td className="text-center py-2">
                                        <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-5">
                                            <button onClick={() => printHandler(sale.invoice)} className="w-6 h-6 cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center py-10 px-4">
                                    Data not available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );

};

export default Invoice;

