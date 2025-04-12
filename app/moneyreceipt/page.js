"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/moneyreceipt/Add";
import Delete from "@/components/moneyreceipt/Delete";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { formatedDate, sortArray } from "@/lib/utils";


const Moneyreceipt = () => {
    const [moneyreceipts, setMoneyreceipts] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const userId = sessionStorage.getItem('user');
                const data = await getDataFromFirebase("moneyreceipt", userId);
                const sortedData = data.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
                console.log(sortedData);
                setMoneyreceipts(sortedData);
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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Moneyreceipt</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>


            <div className="w-full p-4 mt-8 border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                             <th className="text-center border-b border-gray-200 px-4 py-1">Ref.No</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">ReceivedFrom</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Amount</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Cash/Cheque</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Contact</th>
                            <th className="font-normal flex justify-end border-b border-gray-200 px-4 py-1">
                                <Add message={messageHandler} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {moneyreceipts.length ? (
                            moneyreceipts.map(moneyreceipt => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={moneyreceipt.id}>  
                                    <td className="text-center py-1 px-4">{moneyreceipt.refNo}</td>
                                    <td className="text-center py-1 px-4">{formatedDate(moneyreceipt.dt)}</td>
                                    <td className="text-start py-1 px-4">{moneyreceipt.whom}</td>
                                    <td className="text-center py-1 px-4">{moneyreceipt.amount}</td>
                                    <td className="text-center py-1 px-4">{moneyreceipt.cash==='cash'?'Cash':'Cheque'}</td>
                                    <td className="text-center py-1 px-4">{moneyreceipt.contact}</td>
                                    <td className="text-center py-2">
                                        <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-5">
                                            <Delete message={messageHandler} id={moneyreceipt.id} data={moneyreceipt} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={12} className="text-center py-10 px-4">
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

export default Moneyreceipt;

