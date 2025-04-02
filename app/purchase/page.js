"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/purchase/Add";
import Edit from "@/components/purchase/Edit";
import Delete from "@/components/purchase/Delete";
// import Print from "@/components/purchase/Print";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";
import { purchaseHelpers } from "@/helpers/purchaseHelpers";



const Purchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const data = await purchaseHelpers();
                console.log(data);
                setPurchases(data);
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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Purchase</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>


            <div className="w-full p-4 border-2 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-1">Product</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Vendor</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Unit</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Cost</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Amount</th>
                            <th className="w-[95px] border-b border-gray-200 px-4 py-2">
                                <div className="w-[90px] h-[45px] flex justify-end space-x-2 p-1 font-normal">
                                    {/* <Print data={purchases} /> */}
                                    <Add message={messageHandler} />
                                </div>
                            </th>
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
                                    <td className="text-center py-2">
                                        {purchase.isUpdatable ? (
                                            <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                                <Edit message={messageHandler} id={purchase.id} data={purchase} />
                                                <Delete message={messageHandler} id={purchase.id} />
                                            </div>
                                        ) : null}
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

