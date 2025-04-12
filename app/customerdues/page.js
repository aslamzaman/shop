"use client";
import React, { useState, useEffect } from "react";

import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { numberWithCommaISO, sortArray } from "@/lib/utils";



const getCustomers = async () => {
    const userId = sessionStorage.getItem('user');
    const [purchaseResponse, saleResponse, customerResponse, paymentResponse] = await Promise.all([
        getDataFromFirebase("purchase", userId),
        getDataFromFirebase("sale", userId),
        getDataFromFirebase("customer", userId),
        getDataFromFirebase("payment", userId)

    ]);
    const join = customerResponse.map(customer => {
        const matchSale = saleResponse.filter(sale => sale.customerId === customer.id);

        const sales = matchSale.map(sale => {
            const purchases = purchaseResponse.find(p => p.id === sale.purchaseId);
            return { ...sale, purchases };
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
                console.log({ newData });
                setSales(newData);
                setWaitMsg('');
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getData();
    }, []);





    return (
        <>
            <div className="w-full py-4">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Customer Dues</h1>
                <p className="w-full text-center text-gray-400">[ Without zero dues ]</p>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>


            <div className="w-full p-4 mt-8 border-2 border-gray-300 shadow-md rounded-md overflow-auto">
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
                                        <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-5">

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

