"use client";
import React, { useState, useEffect } from "react";
import { formatedDate } from "@/lib/utils";
import { purchaseHelper, salesHelper } from "@/helpers/purchasesaleHelpers";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BtnEn, TextDt } from "@/components/Form";




const Purchasesale = () => {
    const [purchases, setPurchases] = useState([]);
    const [sales, setSales] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("");


    const [purchaseTotal, setPurchaseTotal] = useState('');
    const [saleTotal, setSaleTotal] = useState('');
    const [profit, setProfit] = useState('');
    const [profitStr, setProfitStr] = useState('');


    const [searchDate1, setSearchDate1] = useState('');
    const [searchDate2, setSearchDate2] = useState('');





    const getData = async (dt1, dt2) => {
        setWaitMsg('Please Wait...');
        try {
            const [purchaseResponse, saleResponse] = await Promise.all([
                purchaseHelper(dt1, dt2),
                salesHelper(dt1, dt2)
            ]);
            console.log({ purchaseResponse, saleResponse });

            setPurchaseTotal(purchaseResponse.total);
            setPurchases(purchaseResponse.data);
            //----------------------
            setSaleTotal(saleResponse.total);
            setSales(saleResponse.data);
            //----------------------
            const balance = (parseFloat(purchaseResponse.total) - parseFloat(saleResponse.total));
            const balanceStatus = balance > 1 ? 'Loss' : 'Profit';
            setProfitStr(balanceStatus);
            setProfit(balance.toFixed(2));
            //----------------------

            setWaitMsg('');
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };



    useEffect(() => {
        const date1 = formatedDate("2024-01-01");
        const date2 = formatedDate(new Date());
        setSearchDate1(date1);
        setSearchDate2(date2);
        getData(date1, date2);
    }, [msg]);




    const searchHandler = () => {
        getData(searchDate1, searchDate2);
    }



    const refreshHandler = async () => {
        setMsg(Date.now());
    }



    const printHandler = async () => {
        const saleTbl = sales.map(row => [row.product, row.customer, row.dt, row.unit, row.cost, row.deduct, row.subTotal]);
        saleTbl.push(['Total', '', '', '', '', '', saleTotal]);

        const purchaseTbl = purchases.map(row => [row.product, row.vendor, row.dt, row.unit, row.cost, row.subTotal]);
        purchaseTbl.push(['Total', '', '', '', '', purchaseTotal]);



        const doc = new jsPDF();
        doc.autoTable({
            theme: 'grid',
            headStyles: {
                fillColor: 'white',
                textColor: "black"
            },
            columnStyles: {
                0: { halign: 'left', cellWidth: 30 },
                1: { halign: 'left', cellWidth: 50 },
                2: { halign: 'center', cellWidth: 25 },
                3: { halign: 'center' },
                4: { halign: 'right' },
                5: { halign: 'right' },
            },  // 0, 1, 2, ...
            startY: 40, // Start position of the table
            tableWidth: 'auto',
            margin: { top: 20, botton: 20 },
            head: [
                [{ content: 'Product', styles: { halign: 'left', lineWidth: 0.1, } },
                { content: 'Vendor', styles: { halign: 'left', lineWidth: 0.1, } },
                { content: 'Date', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Unit', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Cost', styles: { halign: 'right', lineWidth: 0.1, } },
                { content: 'Amount', styles: { halign: 'right', lineWidth: 0.1, } }],
            ], // Table headers  
            body: purchaseTbl,
            didDrawPage: (data) => {
                doc.setFontSize(16);
                doc.text('Purchase Table', data.settings.margin.left, 38);
            }
        });


        const finalY = doc.lastAutoTable.finalY + 20;

        doc.autoTable({
            theme: 'grid',
            headStyles: {
                fillColor: 'white',
                textColor: "black"
            },
            columnStyles: {
                0: { halign: 'left', cellWidth: 30 },
                1: { halign: 'left', cellWidth: 50 },
                2: { halign: 'center', cellWidth: 25 },
                3: { halign: 'center' },
                4: { halign: 'right' },
                5: { halign: 'right' },
                6: { halign: 'right' },
            },  // 0, 1, 2, ...
            startY: finalY, // Start position of the table
            tableWidth: 'auto',
            margin: { top: 20, botton: 20 },

            head: [
                [{ content: 'Product', styles: { halign: 'left', lineWidth: 0.1, } },
                { content: 'Customer', styles: { halign: 'left', lineWidth: 0.1, } },
                { content: 'Date', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Unit', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Cost', styles: { halign: 'right', lineWidth: 0.1, } },
                { content: 'Deduct', styles: { halign: 'right', lineWidth: 0.1, } },
                { content: 'Amount', styles: { halign: 'right', lineWidth: 0.1, } }],
            ], // Table headers  
            body: saleTbl,
            didDrawPage: (data) => {
                doc.setFontSize(16);
                doc.text('Sales Table', data.settings.margin.left, finalY - 2);
            },

        });


        const finalY1 = doc.lastAutoTable.finalY + 20;


        doc.autoTable({
            theme: 'grid',
            columnStyles: {
                0: { halign: 'left', cellWidth: 30 },
                1: { halign: 'right' },
            },  // 0, 1, 2, ...
            startY: finalY1, // Start position of the table
            tableWidth: 'auto',
            margin: { top: 20, botton: 20 },
            body: [["Total", profit]],
            styles: {

                fontStyle: 'bold',
                valign: 'middle'
            },
            didDrawPage: (data) => {
                doc.setFontSize(16);
                doc.text(`${profitStr}`, data.settings.margin.left, finalY1 - 2);
            }
        });



        // Save the PDF
        const numOfPages = doc.internal.getNumberOfPages();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(10);
        for (let i = 1; i <= numOfPages; i++) {
            doc.setPage(i);
            doc.text(`Page ${i}  of ${numOfPages}`, 15, pageHeight - 10);
        }
        doc.save('sale_profit.pdf');
    }



    return (
        <>
            <div className="w-full py-4">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Purchase & Sale</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>

            <div className="w-full flex items-center justify-end overflow-auto">
                <div className="w-[300px] flex">
                    <div className="w-[150px]">
                        <TextDt Title="Search Date-Start" Id="searchDate1" Change={e => setSearchDate1(e.target.value)} Value={searchDate1} />
                    </div>
                    <div className="w-[150px]">
                        <TextDt Title="Search Date-End" Id="searchDate2" Change={e => setSearchDate2(e.target.value)} Value={searchDate2} />
                    </div>
                </div>
                <BtnEn Title="Search" Click={searchHandler} Class="bg-blue-400 hover:bg-blue-600 text-white" />
                <BtnEn Title="Print" Click={printHandler} Class="bg-blue-800 hover:bg-blue-900 text-white" />
                <BtnEn Title="Refresh" Click={refreshHandler} Class="bg-blue-600 hover:bg-blue-800 text-white" />
            </div>


            <div className="w-full p-4 border-2 shadow-md rounded-md overflow-auto">
                <h1 className="text-start text-2xl font-bold">Purchase</h1>
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-1">Product</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Vendor</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Unit</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Cost</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.length ? (
                            purchases.map(purchase => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={purchase.id}>
                                    <td className="text-start py-1 px-4">{purchase.product}</td>
                                    <td className="text-start py-1 px-4">{purchase.vendor}</td>
                                    <td className="text-center py-1 px-4">{purchase.dt}</td>
                                    <td className="text-center py-1 px-4">{purchase.unit}</td>
                                    <td className="text-center py-1 px-4">{purchase.cost}</td>
                                    <td className="text-center py-1 px-4">{purchase.subTotal}</td>
                                </tr>
                            ))
                        ) : null}

                        <tr className="font-bold border-b border-gray-200 hover:bg-gray-100">
                            <td className="text-start py-1 px-4">Total</td>
                            <td className="text-start py-1 px-4"></td>
                            <td className="text-center py-1 px-4"></td>
                            <td className="text-center py-1 px-4"></td>
                            <td className="text-center py-1 px-4"></td>
                            <td className="text-center py-1 px-4">{purchaseTotal}</td>
                        </tr>
                    </tbody>
                </table>
            </div>





            <div className="w-full p-4 mt-10 border-2 shadow-md rounded-md overflow-auto">
                <h1 className="text-start text-2xl font-bold">Sales</h1>
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-1">Product</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Customer</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Unit</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Cost</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Deduct</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length ? (
                            sales.map(sale => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={sale.id}>
                                    <td className="text-start py-1 px-4">{sale.product}</td>
                                    <td className="text-start py-1 px-4">{sale.customer}</td>
                                    <td className="text-center py-1 px-4">{sale.dt}</td>
                                    <td className="text-center py-1 px-4">{sale.unit}</td>
                                    <td className="text-center py-1 px-4">{sale.cost}</td>
                                    <td className="text-center py-1 px-4">{sale.deduct}</td>
                                    <td className="text-center py-1 px-4">{sale.subTotal}</td>
                                </tr>)
                            )
                        ) : null}
                        <tr className="font-bold border-b border-gray-200 hover:bg-gray-100">
                            <td className="text-start py-1 px-4">Total</td>
                            <td className="text-start py-1 px-4"></td>
                            <td className="text-center py-1 px-4"></td>
                            <td className="text-center py-1 px-4"></td>
                            <td className="text-center py-1 px-4"></td>
                            <td className="text-center py-1 px-4"></td>
                            <td className="text-center py-1 px-4">{saleTotal}</td>
                        </tr>
                    </tbody>
                </table>
            </div>





            <div className="w-full p-4 mt-10 border-2 shadow-md rounded-md overflow-auto">
                <h1 className="text-start text-2xl font-bold">{profitStr} = {profit}</h1>
            </div>



        </>
    );

};

export default Purchasesale;

