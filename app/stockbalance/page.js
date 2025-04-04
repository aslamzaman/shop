"use client";
import React, { useState, useEffect } from "react";
import { formatedDate, numberWithCommaISO } from "@/lib/utils";
import { stockBalance } from "@/helpers/stockbalanceHelpers";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BtnEn, TextDt } from "@/components/Form";



const Purchasesale = () => {
    const [stocks, setStocks] = useState([]);
    const [total, setTotal] = useState('');
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("");



    const [searchDate1, setSearchDate1] = useState('');
    const [searchDate2, setSearchDate2] = useState('');



    const load = async (dt1, dt2) => {
        const data = await stockBalance(dt1, dt2);
        console.log({ data });
        setStocks(data.result);
        setTotal(data.gt);
    }


    useEffect(() => {
        const date1 = formatedDate("2024-01-01");
        const date2 = formatedDate(new Date());
        setSearchDate1(date1);
        setSearchDate2(date2);
        load(date1, date2);
    }, [msg]);




    const searchHandler = async () => {
        await load(searchDate1, searchDate2);
    }



    const refreshHandler = async () => {
        setMsg(Date.now());
    }



    const printHandler = async () => {
        const stockTable = stocks.map(stock => [stock.product, stock.dt, numberWithCommaISO(stock.qty), numberWithCommaISO(stock.sale), numberWithCommaISO(stock.stock), numberWithCommaISO(stock.purchasePrice), numberWithCommaISO(stock.stockAmount)]);
        stockTable.push(["Total", "", "", "", "", "", numberWithCommaISO(total)])


        const doc = new jsPDF();
        doc.autoTable({
            theme: 'grid',
            headStyles: {
                fillColor: 'white',
                textColor: "black"
            },
            columnStyles: {
                0: { halign: 'left', cellWidth: 30 },
                1: { halign: 'center', },
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
                [{ content: 'Product', styles: { halign: 'left', lineWidth: 0.1, } },
                { content: 'Date', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Purchase', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Sale', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Stock', styles: { halign: 'center', lineWidth: 0.1, } },
                { content: 'Price', styles: { halign: 'right', lineWidth: 0.1, } },
                { content: 'Amount', styles: { halign: 'right', lineWidth: 0.1, } }],
            ], // Table headers  
            body: stockTable,
            didDrawPage: (data) => {
                doc.setFontSize(16);
                doc.text('Stock/Balance', 105, 50, { align: 'center' });
                doc.setFontSize(10);
                doc.text(`Period: ${searchDate1} to ${searchDate2}`, 105, 55, { align: 'center' });
                doc.setFontSize(8);
                doc.text(`Print Date: ${formatedDate(new Date())}`, 195.5, 62, { align: 'right' });
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
        doc.save('stock_balance.pdf');
    }




    return (
        <>
            <div className="w-full py-4">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Stock/Balance</h1>
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
                <BtnEn Title="Refresh" Click={refreshHandler} Class="bg-blue-600 hover:bg-blue-800 text-white" />
                <BtnEn Title="Print" Click={printHandler} Class="bg-blue-800 hover:bg-blue-900 text-white" />
            </div>


            <div className="w-full p-4 border-2 shadow-md rounded-md overflow-auto">
                <h1 className="text-start text-2xl font-bold">Stock/Balance</h1>
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-1">Product</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Purchase</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Sale</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Stock</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Purchase Price</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.length ? (
                            stocks.map(stock => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={stock.id}>
                                    <td className="text-start py-1 px-4">{stock.product}</td>
                                    <td className="text-center py-1 px-4">{stock.dt}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(stock.qty)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(stock.sale)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(stock.stock)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(stock.purchasePrice)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(stock.stockAmount)}</td>
                                </tr>
                            ))
                        ) : null}

                        <tr className="font-bold border-b border-gray-200 hover:bg-gray-100">
                            <td className="text-start py-1 px-4">Total</td>
                            <td className="text-start py-1 px-4"></td>
                            <td className="text-center py-1 px-4"></td>
                            <td className="text-center py-1 px-4"></td>
                            <td className="text-center py-1 px-4"></td>
                            <td className="text-center py-1 px-4"></td>
                            <td className="text-end py-1 px-4">{numberWithCommaISO(total)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );

};

export default Purchasesale;

