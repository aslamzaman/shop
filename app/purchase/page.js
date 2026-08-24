"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/purchase/Add";
import Edit from "@/components/purchase/Edit";
import Delete from "@/components/purchase/Delete";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";
import { numberWithCommaISO } from "@/lib/utils";



const Purchase = () => {
    const [purchases, setPurchases] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");
    const [headerMsg, setHeaderMsg] = useState("Data ready");

    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const year = sessionStorage.getItem('y');
                const [purchaseResponse, productResponse, vendorResponse] = await Promise.all([
                    getDataFromFirebase("purchase"),
                    getDataFromFirebase("product"),
                    getDataFromFirebase("vendor")
                ]);
                const join = purchaseResponse.map(purchase => {
                    const matchProduct = productResponse.find(p => p.id === purchase.productId);
                    const matchVendor = vendorResponse.find(v => v.id === purchase.vendorId);
                    return {
                        ...purchase,
                        product: matchProduct ? `${matchProduct.name}- ${matchProduct.description}` : "",
                        vendor: matchVendor ? matchVendor.name : ""
                    }
                })
                console.log(join)
                const purchaseByYear = join.filter(p => p.yr === Number(year))
                console.log(purchaseByYear)
                const sortedData = purchaseByYear.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
                console.log(sortedData);
                setPurchases(sortedData);
                setWaitMsg('');


                // Header summery ----------------------------------------------------------

                const totalThaan = purchaseByYear.reduce((t, c)=> t + Number(c.shadeNo), 0);
                const totalMeter = purchaseByYear.reduce((t, c)=> t + Number(c.qty), 0);
                const totalAmount = purchaseByYear.reduce((t, c)=> t + Number(c.qty) * Number(c.price), 0);                
                setHeaderMsg(`Thaan = ${numberWithCommaISO(totalThaan)} || Meter = ${numberWithCommaISO(totalMeter)} || Amount = ${numberWithCommaISO(totalAmount)}`)




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
                <h1 className="w-full text-md font-bold text-center text-black">&nbsp;{headerMsg}&nbsp;</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>




            <div className="w-full p-4 mt-8 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Shipment</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Vendor</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Product</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Thaan</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Quantity(Meter)</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Price</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Total</th>
                            <th className="font-normal flex justify-end border-b border-gray-200 px-4 py-1">
                                <Add message={messageHandler} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.length ? (                            
                            purchases.map(purchase => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={purchase.id}>
                                    <td className="text-center py-1 px-4">{purchase.dt}</td>
                                    <td className="text-center py-1 px-4">{purchase.shipment}</td>
                                    <td className="text-start py-1 px-4">{purchase.vendor}</td>
                                    <td className="text-start py-1 px-4">{purchase.product}</td>
                                    <td className="text-center py-1 px-4">{purchase.shadeNo}</td>
                                    <td className="text-end py-1 px-4">{(purchase.qty).toFixed(2)}</td>
                                    <td className="text-end py-1 px-4">{(purchase.price).toFixed(2)}</td>
                                    <td className="text-end py-1 px-4">
                                        {
                                        (purchase.qty * purchase.price).toFixed(2)
                                        }
                                    </td>
                                    <td className="text-center py-2">                                 
                                        <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                            <Edit message={messageHandler} id={purchase.id} data={purchase} />
                                            <Delete message={messageHandler} id={purchase.id} data={purchase} />
                                        </div>                                     
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

