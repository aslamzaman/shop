"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/sale/Add";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { formatedDate, numberWithCommaISO, sortArray } from "@/lib/utils";
import Delete from "@/components/sale/Delete";


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
        const balance = (totalSale + totalTax) - (totalPayment + totalDeduct);
        const ids = matchSale.map(s => s.id);
        return {
            invoice,
            customer: matchSale[0].customer,
            totalSale,
            totalTax,
            totalPayment,
            totalDeduct,
            balance,
            dt: matchSale[0].dt,
            ids
        }
    })
    const sortedData = result.sort((a, b) => sortArray(Number(b.invoice), Number(a.invoice)));
    return sortedData;
}



const Sale = () => {
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




    return (
        <>
            <div className="w-full py-4">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Sales</h1>
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
                                      <Delete message={messageHandler} ids={sale.ids} />
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

export default Sale;

