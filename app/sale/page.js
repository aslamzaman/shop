"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/sale/Add";
import Edit from "@/components/sale/Edit";
import Delete from "@/components/sale/Delete";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";



const Sale = () => {
    const [sales, setSales] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const year = sessionStorage.getItem('y');
                const [saleResponse, customerResponse, productResponse] = await Promise.all([
                    getDataFromFirebase("sale"),
                    getDataFromFirebase("customer"),
                    getDataFromFirebase("product")
                ]);
                const join = saleResponse.map(sale => {
                    const matchCustomer = customerResponse.find(c => c.id === sale.customerId);
                    const matchProduct = productResponse.find(pr => pr.id === sale.productId);
                    return {
                        ...sale,
                        customer: matchCustomer ? matchCustomer.name : '',
                        product: matchProduct ? matchProduct.name : ''
                    }
                })
                console.log(join)
                const saleByYear = join.filter(s => s.yr === Number(year))
                console.log(saleByYear)
                const sortedData = saleByYear.sort((a, b) => sortArray(new Date(b.dt), new Date(a.dt)));
                console.log(sortedData);
                setSales(sortedData);
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




            <div className="w-full p-4 mt-8 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">                           
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Customer</th>
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
                        {sales.length ? (                            
                            sales.map(sale => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={sale.id}>
                                    <td className="text-center py-1 px-4">{sale.dt}</td>
                                    <td className="text-start py-1 px-4">{sale.customer}</td>
                                    <td className="text-start py-1 px-4">{sale.product}</td>
                                    <td className="text-center py-1 px-4">{sale.shadeNo}</td>
                                    <td className="text-end py-1 px-4">{(sale.qty).toFixed(2)}</td>
                                    <td className="text-end py-1 px-4">{(sale.price).toFixed(2)}</td>
                                    <td className="text-end py-1 px-4">
                                        {
                                        (sale.qty * sale.price).toFixed(2)
                                        }
                                    </td>
                                    <td className="text-center py-2">                                 
                                        <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                            <Edit message={messageHandler} id={sale.id} data={sale} />
                                            <Delete message={messageHandler} id={sale.id} data={sale} />
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

export default Sale;

