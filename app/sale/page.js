"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/sale/Add";

import Edit from "@/components/sale/Edit";
import Delete from "@/components/sale/Delete";

import { productStock, salesData } from "@/helpers/saleHelpers";


const Purchase = () => {
    const [sales, setSales] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const [stock, sale] = await Promise.all([
                    productStock(),
                    salesData()
                ]);
                setPurchases(stock);
                setSales(sale);
                console.log(sale)
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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Sale</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>


            <div className="w-full p-4 border-2 shadow-md rounded-md overflow-auto">
                <h1 className="text-start text-2xl font-bold">Stock (Balance)</h1>
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-1">Product</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Vendor</th> 
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-blue-600 text-center border-b border-gray-200 px-4 py-1">Stock</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Cost</th>
                            <th className="w-[95px] border-b border-gray-200 px-4 py-2">
                                <div className="w-[90px] h-[45px] py-2 text-black font-bold">Action</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.length ? (
                            purchases.map(purchase => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={purchase.id}>
                                    <td className="text-start py-1 px-4">{purchase.product.name}</td>
                                    <td className="text-start py-1 px-4">{purchase.vendor.name}</td>
                                    <td className="text-center py-1 px-4">{purchase.dt}</td>
                                    <td className="text-blue-600 text-center py-1 px-4">{purchase.stock}</td>
                                    <td className="text-center py-1 px-4">{purchase.cost}</td>
                                    <td className="text-center py-2">
                                        <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                            <Add message={messageHandler} id={purchase.id} data={purchase} />
                                        </div>
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



            <div className="w-full p-4 mt-10 border-2 shadow-md rounded-md overflow-auto">
                <h1 className="text-start text-2xl font-bold">Sale</h1>
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-1">Product</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Vendor</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Customer</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Unit</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Deduct</th>
                            <th className="w-[95px] border-b border-gray-200 px-4 py-2">
                                <div className="w-[90px] h-[45px] py-2 font-bold flex justify-end items-center space-x-1 mt-1 mr-1">
                                    Actions
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length ? (
                            sales.map(sale => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={sale.id}>
                                    <td className="text-start py-1 px-4">{sale.product.name}</td>
                                    <td className="text-start py-1 px-4">{sale.vendor.name}</td>
                                    <td className="text-start py-1 px-4">{sale.customer.name}</td>
                                    <td className="text-center py-1 px-4">{sale.dt}</td>
                                    <td className="text-center py-1 px-4">{sale.unit}</td>
                                    <td className="text-center py-1 px-4">{sale.deduct}</td>
                                    <td className="text-center py-2">
                                        <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                            <Edit message={messageHandler} id={sale.id} data={sale} />
                                            <Delete message={messageHandler} id={sale.id} />
                                        </div>
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

