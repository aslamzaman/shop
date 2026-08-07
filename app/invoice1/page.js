"use client";
import React, { useEffect, useState } from "react";
import { formatedDateDot, numberWithComma, inwordEnglish } from "@/lib/utils";
import { getDataFromFirebase } from "@/lib/firebaseFunction";

import { jsPDF } from "jspdf";


const Invoice = () => {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const [customerResponse, productResponse] = await Promise.all([
                    getDataFromFirebase("customer"),
                    getDataFromFirebase("product")
                ]);
                setCustomers(customerResponse);
                setProducts(productResponse);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        getData();
    }, []);



    const clickMe = (e) => {
        e.preventDefault();

        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,
            floatPrecision: 16 // or "smart", default is 16
        });

        const prinDate = new Date();
        const dtText = `Print Data: ${formatedDateDot(prinDate)}`

        const invoice = {
            invoiceNo: 29759231,
            dt: "2026-04-22",
            customerId: "P0xIexrAbcHWdLwvRsbg",
            payment: 5000,
            deduct: 150,
            yr: 2026,
            products: [
                {
                    productId: "ASSFetz55QlLqR1Vfd2k",
                    thn: 1,
                    qty: 13,
                    price: 300
                },
                {
                    productId: "RtkQIVwSlPvZ7wfM17Um",
                    thn: 2,
                    qty: 26,
                    price: 370
                },
                {
                    productId: "kbBAI5MtdWRuVmBkRh1e",
                    thn: 1,
                    qty: 10,
                    price: 335
                }
            ],
        }
        console.log(invoice)
        const customer = customers.find(c => c.id === invoice.customerId);
        console.log(customer)  //---------------------------------------

        const productList = invoice.products;
        const productData = productList.map(p => {
            const matchProduct = products.find(item => item.id === p.productId);
            return {
                name: matchProduct.name,
                thn: p.thn,
                qty: p.qty,
                price: p.price
            }
        })
        console.log(productData); //---------------------------------------
        doc.setFont("times", "bold");
        doc.setFontSize(18);


        let y = 50;
        doc.text("BILL/INVOICE", 105, y, { maxWidth: doc.getTextWidth("BILL/INVOICE").toFixed(0), align: 'center' });


        doc.setFont("times", "normal");
        doc.setFontSize(12);
        doc.text(dtText, 105, y + 4, { align: 'center' });

        y += 20;

        doc.text(customer["name"], 22, y + 5, { align: 'left' });
        doc.text(customer["address"], 22, y + 10, { align: 'left' });
        doc.text(customer["mobile"], 22, y + 15, { align: 'left' });

        doc.text(`Invoice No: ${invoice["invoiceNo"]}`, 188, y + 5, { align: 'right' });
        doc.text(`Invoice Date: ${invoice["dt"]}`, 188, y + 10, { align: 'right' });



        doc.setFont("times", "bold");
        y += 30;
        doc.line(20, y + 1.5, 190, y + 1.5);
        doc.text("PRODUCT NAME", 22, y, { align: 'left' });   
        doc.text("THAAN", 90, y, { align: 'center' });
        doc.text("QUANTITY(M)", 120, y, { align: 'center' });
        doc.text("RATE", 155, y, { align: 'right' });
        doc.text("TOTAL", 188, y, { align: 'right' });


        doc.setFont("times", "normal");
        y += 5.5;
        let subTotal = 0;
        for (let i = 0; i < productData.length; i++) {
            const total = productData[i]["price"] * productData[i]["price"];
            doc.line(20, y + 1.5, 190, y + 1.5);
            doc.text(productData[i]["name"], 22, y, { align: 'left' });   
            doc.text(`${productData[i]["thn"]}`, 90, y, { align: 'center' });
            doc.text(`${productData[i]["qty"]}`, 120, y, { align: 'center' });
            doc.text(`${productData[i]["price"]}`, 155, y, { align: 'right' });
            doc.text(`${numberWithComma(total)}`, 188, y, { align: 'right' });
            y += 5.5;
            subTotal += total;
        }

        y += 5.5;
        doc.line(20, y + 1.5, 190, y + 1.5);
        doc.text("Payment (-)", 22, y, { align: 'left' }); // Payment
        doc.text(`${numberWithComma(invoice["payment"])}`, 188, y, { align: 'right' }); // Payment

        y += 5.5;
        doc.line(20, y + 1.5, 190, y + 1.5);
        doc.text("Deduct (-)", 22, y, { align: 'left' }); // Deduct
        doc.text(`${numberWithComma(invoice["deduct"])}`, 188, y, { align: 'right' }); // Deduct

        y += 11;
        doc.setFont("times", "bold");
        const GTotal = subTotal - invoice["payment"] - invoice["deduct"];
        doc.line(20, y + 1.5, 190, y + 1.5);
        doc.text("Amount to pay", 22, y, { align: 'left' }); // Amount to pay
        doc.text(`${numberWithComma(GTotal)}`, 188, y, { align: 'right' }); // Amount to pay     

        y += 5.5;
        doc.setFont("times", "normal");
        const inword = inwordEnglish(GTotal);
        const fullInword = `Inword: ${inword.charAt(0).toUpperCase() + inword.slice(1).toLowerCase()} only.`;

        doc.text(fullInword, 22, y, { align: 'left' }); // Inword


        doc.save("test.pdf")
    }





    return (
        <>
            <div className="w-full py-4">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">jsPDF</h1>
            </div>
            <button onClick={clickMe}>Click</button>
        </>
    );

};

export default Invoice;

