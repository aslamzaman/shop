"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/sale/Add";
import { saleHelp, getDataForInvoice, saleHelpers } from "@/helpers/saleHelpers";
import Delete from "@/components/sale/Delete";
import { jsPDF } from "jspdf";
import { numberWithCommaISO, formatedDate } from "@/lib/utils";






const Purchase = () => {
    const [sales, setSales] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");



    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const data = await saleHelpers();
                // console.log(data);
                setSales(data);
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



    const printHandler = async (invoice) => {
        const data = await getDataForInvoice(invoice);
        console.log({ data });
        const customer = data[0].matchCustomer.name;
        const customerAddress = data[0].matchCustomer.address;
        const customerEmail = data[0].matchCustomer.email;
        const customerPhone = data[0].matchCustomer.phone;



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
        // doc.line(50, 56.5, 160, 56.5);

        doc.text("Bill To: ", 25, 75, { align: "left" });
        doc.text(`${customer}`, 40, 75, { align: "left" });
        doc.setFont("times", "normal");
        doc.text(`${customerAddress}`, 40, 80, { align: "left" });
        doc.text(`${customerEmail}`, 40, 85, { align: "left" });
        doc.text(`${customerPhone}`, 40, 90, { align: "left" });

        doc.text(`Invoice Number: ${data[0].invoice}`, 183, 75, { align: "right" });
        doc.text(`Invoice Date: ${formatedDate(data[0].dt)}`, 183, 80, { align: "right" });
        doc.text(`Print Date: ${formatedDate(new Date())}`, 183, 85, { align: "right" });





        doc.setFont("times", "bold");
        doc.text("Product Name", 27, 110, { align: "left" });
        doc.text("Unit Price", 110, 110, { align: "center" });
        doc.text("Quantity", 145, 110, { align: "center" });
        doc.text("Total", 183, 110, { align: "right" });
        doc.line(25, 112, 185, 112);
        doc.setFont("times", "normal");

        let y = 117;
        let subTotal = 0;
        for (let i = 0; i < data.length; i++) {
            const product = data[i].matchPurchase.matchProduct.name;
            const total = parseFloat(data[i].matchPurchase.salePrice) * parseFloat(data[i].qty);
            const price = data[i].matchPurchase.salePrice;
            const qty = data[i].qty;
            doc.text(`${product}`, 27, y, { align: "left" });
            doc.text(`${numberWithCommaISO(price)}`, 110, y, { align: "center" });
            doc.text(`${numberWithCommaISO(qty)}`, 145, y, { align: "center" });
            doc.text(`${numberWithCommaISO(total)}`, 183, y, { align: "right" });
            subTotal = subTotal + total;
            y = y + 5;
        }

        const tx = data.reduce((t, c) => t + parseFloat(c.tax), 0);
        const taxCalculate = subTotal * (tx / 100);
        const deduct = data.reduce((t, c) => t + parseFloat(c.deduct), 0);
        const payment = data.reduce((t, c) => t + parseFloat(c.payment), 0);

        const dues = subTotal + taxCalculate - payment - deduct;

        doc.line(25, y - 3, 185, y - 3);
        doc.setFont("times", "bold");
        doc.text("Sub Total", 27, y + 1, { align: "left" });
        doc.text(`${numberWithCommaISO(subTotal)}`, 183, y + 1, { align: "right" });


        doc.setFont("times", "normal");
        doc.text(`Tax (${parseFloat(tx)}%)`, 27, y + 8, { align: "left" });
        doc.text(`${numberWithCommaISO(taxCalculate)}`, 183, y + 8, { align: "right" });
        doc.text("Payment", 27, y + 13, { align: "left" });
        doc.text(`${numberWithCommaISO(payment)}`, 183, y + 13, { align: "right" });
        doc.text("Deduct", 27, y + 18, { align: "left" });
        doc.text(`${numberWithCommaISO(deduct)}`, 183, y + 18, { align: "right" });


        doc.setFont("times", "bold");
        doc.line(25, y + 19.5, 185, y + 19.5);
        doc.text("Balance/Dues", 27, y + 23, { align: "left" });
        doc.text(`${numberWithCommaISO(dues)}`, 183, y + 23, { align: "right" });

        doc.text("Thank You", 183, y + 50, { align: "right" });
        doc.setFont("times", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text("I need your cooperation at all times.", 27, y + 50, { align: "left" });

        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFontSize(9);
        doc.text("Please contact us for feedback regarding this software: aslamcmes@gmail.com", pageWidth - 12, pageHeight - 4, { align: "right" });

        doc.save("invoice.pdf");
    }



    return (
        <>
            <div className="w-full py-4">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Sale</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-center text-2xl text-green-700 animate-pulse">NB. You can also print from the <span className="font-bold">Invoice</span> menu.</p>
            </div>



            <div className="w-full p-4 mt-10 border-2 shadow-md rounded-md overflow-auto">
                <div className="w-full pb-4 flex justify-between items-center">
                    <p className="w-full text-sm text-start text-pink-600">&nbsp;{msg}&nbsp;</p>
                    <Add message={messageHandler} />
                </div>
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-1">Invoice</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Customer</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Sale Amount</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Tax</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Payment</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Deduct</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Balance</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>



                        {sales.length ? (
                            sales.map(sale => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={sale.invoice}>
                                    <td className="text-start py-1 px-4">{sale.invoice}</td>
                                    <td className="text-start py-1 px-4">{sale.customer}</td>
                                    <td className="text-center py-1 px-4">{formatedDate(sale.dt)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.saleAmount)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.taxAmount)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.totalPayment)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.totalDeduct)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.balance)}</td>
                                    <td className="flex justify-end items-center space-x-1 mr-2">
                                        <button onClick={() => printHandler(sale.invoice)} className="w-6 h-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                            </svg>
                                        </button>



                                        <Delete message={messageHandler} ids={sale.ids} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-10 px-4">
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

export default Purchase;

