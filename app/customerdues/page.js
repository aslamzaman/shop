"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/sale/Add";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { formatedDate, numberWithCommaISO, sortArray } from "@/lib/utils";
import Delete from "@/components/sale/Delete";


const getCustomers = async () => {
    const userId = sessionStorage.getItem('user');
    const [purchaseResponse, saleResponse, customerResponse] = await Promise.all([
        getDataFromFirebase("purchase", userId),
        getDataFromFirebase("sale", userId),
        getDataFromFirebase("customer", userId)
    ]);
    const join = customerResponse.map(customer => {
        const matchSale = saleResponse.filter(sale => sale.customerId === customer.id);
        const sales = matchSale.map(sale => {
            const purchases = purchaseResponse.find(p => p.id === sale.purchaseId);
            return { ...sale, purchases };
        })
        return {
            ...customer,
            sales
        }
    })

    const result = join.sort((a, b) => sortArray(a.name.toUpperCase(), b.name.toUpperCase()));

    const data = result.map(sale => {
        const saleCalculation = sale.sales.map(s => {
            const salePriceWithTax = s.purchases.salePrice + (s.purchases.salePrice * (s.purchases.tax/100) );
            const saleAmount = s.qty * salePriceWithTax;
            const paymentAmount = s.payment + s.deduct;
            const duesAmount = saleAmount- paymentAmount;
            return{
                ...s,
                saleAmount,
                paymentAmount,
                duesAmount
            }
        })
        return {...sale,saleCalculation};
    })

const finalize = data.map(sale=>{
    const saleTk = sale.saleCalculation.reduce((t,c)=>t + c.saleAmount,0);
    const payTk = sale.saleCalculation.reduce((t,c)=>t + c.paymentAmount,0);
    const dueTk = sale.saleCalculation.reduce((t,c)=>t + c.duesAmount,0);
    return {...sale, saleTk,payTk,dueTk}
})

    return finalize;
}



const Customerdues = () => {
    const [sales, setSales] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


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
    }, [msg]);


    const messageHandler = (data) => {
        setMsg(data);
    }




    return (
        <>
            <div className="w-full py-4">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Customer Dues</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>


            <div className="w-full p-4 mt-8 border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-center border-b border-gray-200 px-4 py-1">Sl</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Customer</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">SaleAmount</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">PaymentAmount</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Balance/Dues</th>
                            <th className="font-normal flex justify-end border-b border-gray-200 px-4 py-1">
                              
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length ? (
                            sales.map((sale,i) => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={sale.id}>
                                    <td className="text-center py-1 px-4">{i+1}</td>
                                    <td className="text-start py-1 px-4">{sale.name}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.saleTk)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.payTk)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(sale.dueTk)}</td>
                                  
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

