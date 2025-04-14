"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/purchase/Add";
import Edit from "@/components/purchase/Edit";
import Delete from "@/components/purchase/Delete";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";



const Purchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const userId = sessionStorage.getItem('user');
                const [purchaseResponse, productResponse, vendorResponse, saleResponse] = await Promise.all([
                    getDataFromFirebase("purchase", userId),
                    getDataFromFirebase("product", userId),
                    getDataFromFirebase("vendor", userId),
                    getDataFromFirebase("sale", userId)
                ]);
                const join = purchaseResponse.map(purchase => {
                    const matchProduct = productResponse.find(p => p.id === purchase.productId);
                    const matchVendor = vendorResponse.find(v => v.id === purchase.vendorId);
                    const matchSale = saleResponse.filter(s => s.purchaseId === purchase.id);
                    return {
                        ...purchase,
                        product: matchProduct ? `${matchProduct.name}- ${matchProduct.description}` : "",
                        vendor: matchVendor ? matchVendor.name : "",
                        isUpdatable: matchSale.length > 0 ? false : true
                    }
                })
                console.log(join)
                const sortedData = join.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
                console.log(sortedData);
                setPurchases(sortedData);
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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Purchases</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>


            <div className="w-full p-4 mt-8 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-1">Product</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Vendor</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Quantity</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">PurchasePrice</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">SalePrice</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Tax(%)</th>
                            <th className="font-normal flex justify-end border-b border-gray-200 px-4 py-1">
                                <Add message={messageHandler} />
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
                                    <td className="text-center py-1 px-4">{purchase.qty}</td>
                                    <td className="text-center py-1 px-4">{purchase.purchasePrice}</td>
                                    <td className="text-center py-1 px-4">{purchase.salePrice}</td>
                                    <td className="text-center py-1 px-4">{purchase.tax}</td>
                                    <td className="text-center py-2">
                                        {purchase.isUpdatable ? (
                                            <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                                <Edit message={messageHandler} id={purchase.id} data={purchase} />
                                                <Delete message={messageHandler} id={purchase.id} data={purchase} />
                                            </div>
                                        ) : null}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center py-10 px-4">
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

