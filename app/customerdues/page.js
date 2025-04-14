"use client";
import React, { useState, useEffect } from "react";

import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { numberWithCommaISO, sortArray,formatedDate } from "@/lib/utils";
import jsPDF from 'jspdf';
import 'jspdf-autotable';






const getCustomers = async () => {
    const userId = sessionStorage.getItem('user');
    const [purchaseResponse, saleResponse, customerResponse, paymentResponse, productResponse] = await Promise.all([
        getDataFromFirebase("purchase", userId),
        getDataFromFirebase("sale", userId),
        getDataFromFirebase("customer", userId),
        getDataFromFirebase("payment", userId),
        getDataFromFirebase("product", userId)

    ]);
    const join = customerResponse.map(customer => {
        const matchSale = saleResponse.filter(sale => sale.customerId === customer.id);

        const sales = matchSale.map(sale => {
            const purchases = purchaseResponse.find(p => p.id === sale.purchaseId);
            const matchProduct = productResponse.find(p => p.id === purchases.productId);
            return { ...sale, purchases, matchProduct };
        })
        const matchPayment = paymentResponse.filter(pay => pay.customerId === customer.id);

        return {
            ...customer,
            sales,
            matchPayment
        }
    })

    const sortData = join.sort((a, b) => sortArray(a.name.toUpperCase(), b.name.toUpperCase()));
    // console.log({ sortData })
    //----------------------------------------------------

    const result = sortData.map(customer => {

        const saleDatas = customer.sales;
        const saleAmount = saleDatas.reduce((t, c) => {
            const salePriceWithTax = c.purchases.salePrice + (c.purchases.salePrice * (c.purchases.tax / 100));
            const saleTotal = c.qty * salePriceWithTax;
            return t + saleTotal;
        }, 0);

        const paymentAmount = saleDatas.reduce((t, c) => t + (c.payment + c.deduct), 0);
        const paymentAfterAmount = customer.matchPayment.reduce((t, c) => t + c.amount, 0);
        const duesAmount = saleAmount - (paymentAmount + paymentAfterAmount);

        return {
            ...customer,
            saleAmount,
            paymentAmount,
            paymentAfterAmount,
            duesAmount
        }
    })
    console.log({ result });
    const withoutZero = result.filter(d => d.duesAmount > 0);
    return withoutZero;
}



const Customerdues = () => {
    const [sales, setSales] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const newData = await getCustomers();
              //  console.log({ newData });
                setSales(newData);
                setWaitMsg('');
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getData();
    }, []);



    const detailHandler = (data) => {
     //   console.log(data);
        const sales = data.sales;
        let gt1 = 0;
        const saleTable = sales.map(sale => {
            const tax = (sale.qty * sale.purchases.salePrice) * (sale.purchases.tax / 100);
            const productName = sale.matchProduct.name;
            const total = (sale.qty * sale.purchases.salePrice) + tax;
            gt1 = gt1 + total;
            return [sale.invoice, productName, sale.dt, numberWithCommaISO(sale.qty), numberWithCommaISO(sale.purchases.salePrice), numberWithCommaISO(tax), numberWithCommaISO(total)]
        });


       // console.log(saleTable)


        const doc = new jsPDF();

        doc.autoTable({
            theme: 'grid',
            headStyles: {
                fillColor: 'white',
                textColor: "black"
            },
            columnStyles: {
                0: { halign: 'center' },
                1: { halign: 'left', },
                2: { halign: 'center' },
                3: { halign: 'center' },
                4: { halign: 'center' },
                5: { halign: 'right' },
                6: { halign: 'right' },

            },  // 0, 1, 2, ...
            startY: 63, // Start position of the table
            tableWidth: 'auto',
            margin: { top: 20, botton: 20 },
            head: [
                [{ content: 'Invoice', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Product', styles: { halign: 'left', lineWidth: 0.1, } },
                { content: 'Date', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Qty', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'SalePrice', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Tax', styles: { halign: 'right', lineWidth: 0.1, } },
                { content: 'Total', styles: { halign: 'right', lineWidth: 0.1, } }]
            ],
            body: saleTable,
            didDrawPage: (data) => {
                doc.setFontSize(16);
                doc.text('Details of Dues', 105, 50, { align: 'center' });
                doc.setFontSize(10);
                doc.text(`Date: ${formatedDate(new Date())}`, 105, 55, { align: 'center' });
                doc.setFont(undefined, "bold");
                doc.text(`Sales details:`, 15, 61, { align: 'left' });
            } 
        });




        // Add new autoTable
        const newStarY = doc.lastAutoTable.finalY + 15;
        const payData = sales.filter(sale => sale.payment > 0);
        let gt2 = 0;
        const pamentTable = payData.map(sale => {
            const productName = sale.matchProduct.name;
            const total = sale.payment + sale.deduct;
            gt2 = gt2 + total;
            return [sale.invoice, productName, sale.dt, numberWithCommaISO(sale.payment), numberWithCommaISO(sale.deduct), numberWithCommaISO(total)]
        });


        doc.autoTable({
            theme: 'grid',
            headStyles: {
                fillColor: 'white',
                textColor: "black"
            },
            columnStyles: {
                0: { halign: 'center' },
                1: { halign: 'left', },
                2: { halign: 'center' },
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' }


            },  // 0, 1, 2, ...
            startY: newStarY, // Start position of the table
            tableWidth: 'auto',
            margin: { top: 20, botton: 20 },
            head: [
                [{ content: 'Invoice', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Product', styles: { halign: 'left', lineWidth: 0.1, } },
                { content: 'Date', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Payment', styles: { halign: 'right', lineWidth: 0.1, } },
                { content: 'Discount', styles: { halign: 'right', lineWidth: 0.1, } },
                { content: 'Total', styles: { halign: 'right', lineWidth: 0.1, } }]

            ],
            body: pamentTable,

            didDrawPage: (data) => {
                doc.setFontSize(10);
                doc.setFont(undefined, "bold");
                doc.text(`Payment at time of sale:`, 15, newStarY-2, { align: 'left' });
            } 
        });




        // Add new autoTable
        const lastStarY = doc.lastAutoTable.finalY + 15;

        let gt3 = 0;
        const finalePamentTable = data.matchPayment.map(sale => {
            gt3 = gt3 + sale.amount;
            return [sale.refNo, sale.dt, sale.cashType, numberWithCommaISO(sale.amount)]
        });




        doc.autoTable({
            theme: 'grid',
            headStyles: {
                fillColor: 'white',
                textColor: "black"
            },
            columnStyles: {
                0: { halign: 'center' },
                1: { halign: 'center', },
                2: { halign: 'center' },
                3: { halign: 'right' },


            },  // 0, 1, 2, ...
            startY: lastStarY, // Start position of the table
            tableWidth: 'auto',
            margin: { top: 20, botton: 20 },
            head: [
                [{ content: 'Ref. No.', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Date', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Type', styles: { halign: 'right', lineWidth: 0.1, } },
                { content: 'Total', styles: { halign: 'right', lineWidth: 0.1, } }]

            ],
            body: finalePamentTable,

            didDrawPage: (data) => {
                doc.setFontSize(10);
                doc.setFont(undefined, "bold");
                doc.text(`Payment at other times:`, 15, lastStarY-2, { align: 'left' });
            } 
        });


        // Add new autoTable
        const GtStarY = doc.lastAutoTable.finalY + 15;
        const gt4 = gt1 - gt2 - gt3;
        doc.autoTable({
            theme: 'grid',
            headStyles: {
                fillColor: 'white',
                textColor: "black"
            },
            columnStyles: {
                0: { halign: 'left' },
            },  // 0, 1, 2, ...
            startY: GtStarY, // Start position of the table
            tableWidth: 'auto',
            margin: { top: 20, botton: 20 },
            head: [
                [{ content: 'Total Payable/Dues', styles: { halign: 'left', lineWidth: 0.1, } }]
            ],
            body: [[`${numberWithCommaISO(gt1)} - (${numberWithCommaISO(gt2)} + ${numberWithCommaISO(gt3)}) = ${numberWithCommaISO(gt4)}`]],
        
        });








        // Set page numbers
        const numOfPages = doc.internal.getNumberOfPages();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(10);
        for (let i = 1; i <= numOfPages; i++) {
            doc.setPage(i);
            doc.text(`Page ${i}  of ${numOfPages}`, 15, pageHeight - 10);
        }
        // Save the PDF
        doc.save(`${new Date().toISOString()}_stock_balance.pdf`);



    }





    return (
        <>
            <div className="w-full py-4">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Customer Dues</h1>
                <p className="w-full text-center text-gray-400">[ Without zero dues ]</p>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>


            <div className="w-full p-4 mt-8 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-center border-b border-gray-200 px-4 py-1">Sl</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Customer</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Sale</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Payments</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">PaymentsAfter</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Balance/Dues</th>
                            <th className="font-normal flex justify-end border-b border-gray-200 px-4 py-1">

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length ? (
                            sales.map((sale, i) => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={sale.id}>
                                    <td className="text-center py-1 px-4">{i + 1}</td>
                                    <td className="text-start py-1 px-4">{sale.name}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.saleAmount)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.paymentAmount)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.paymentAfterAmount)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.duesAmount)}</td>

                                    <td className="text-center py-2">
                                        <div className="h-8 flex justify-end items-center space-x-1 mr-5">
                                            <button onClick={() => detailHandler(sale)} className="w-7 h-7 cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="0" stroke="currentColor" className="w-full h-full p-0.5 stroke-black fill-black">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m 5.8789062,12.425781 v 1.126953 h 3.2558594 v -1.126953 z m 0,3.546875 v 1.126953 h 3.2558594 v -1.126953 z m 0,-7.0937497 V 10.005859 H 10.640625 V 8.8789063 Z m 0,-3.5468751 V 6.4589844 H 16.957031 V 5.3320312 Z M 17.5625,16.966797 l -0.796875,0.796875 5.601562,5.599609 0.794922,-0.794922 z m -2.734375,-6.916016 c -2.559336,0 -4.646484,2.085195 -4.646484,4.644532 -1e-6,2.559336 2.087147,4.646484 4.646484,4.646484 2.559337,0 4.644531,-2.087148 4.644531,-4.646484 0,-2.559337 -2.085195,-4.644532 -4.644531,-4.644532 z m 0,1.125 c 1.95086,0 3.519531,1.568671 3.519531,3.519532 0,1.95086 -1.568671,3.521484 -3.519531,3.521484 -1.95086,0 -3.521485,-1.570624 -3.521484,-3.521484 0,-1.950861 1.570624,-3.519532 3.521484,-3.519532 z M 4.3164062,0.63671875 c -1.917195,0 -3.47851557,1.55936735 -3.47851557,3.47656245 V 18.318359 c -10e-9,1.917196 1.56132067,3.478516 3.47851557,3.478516 H 18.519531 c 1.917195,0 3.478516,-1.561321 3.478516,-3.478516 V 4.1132812 c 0,-1.917195 -1.561321,-3.47656245 -3.478516,-3.47656245 z m 0,1.12499995 H 18.519531 c 1.312927,0 2.351563,1.0386356 2.351563,2.3515625 V 18.318359 c 0,1.312927 -1.038636,2.351563 -2.351563,2.351563 H 4.3164062 c -1.3129268,0 -2.3535156,-1.038636 -2.3535156,-2.351563 V 4.1132812 c 0,-1.3129268 1.0405889,-2.3515625 2.3535156,-2.3515625 z" />
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

export default Customerdues;

