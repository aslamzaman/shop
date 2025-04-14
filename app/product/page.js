"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/product/Add";
import Edit from "@/components/product/Edit";
import Delete from "@/components/product/Delete";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";


const Product = () => {
    const [products, setProducts] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {

                const userId = sessionStorage.getItem('user');
                const [productResponse, purchaseResponse] = await Promise.all([
                    getDataFromFirebase("product", userId),
                    getDataFromFirebase("purchase", userId)
                ]);

                const productUpdateCheck = productResponse.map(product => {
                    const matchPurchase = purchaseResponse.filter(purchase => purchase.productId === product.id);
                    return {
                        ...product,
                        isUpdatable: matchPurchase.length > 0 ? false : true
                    }
                })
                const sortedData = productUpdateCheck.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
                console.log(sortedData);
                setProducts(sortedData);
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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Products</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>


            <div className="w-full p-4 mt-8 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-1">Name</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Description</th>
                            <th className="font-normal flex justify-end border-b border-gray-200 px-4 py-1">
                                <Add message={messageHandler} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length ? (
                            products.map(product => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={product.id}>
                                    <td className="text-start py-1 px-4">{product.name}</td>
                                    <td className="text-start py-1 px-4">{product.description}</td>
                                    <td className="text-center py-2">
                                        {product.isUpdatable ? (
                                            <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                                <Edit message={messageHandler} id={product.id} data={product} />
                                                <Delete message={messageHandler} id={product.id} data={product} />
                                            </div>
                                        ) : null}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center py-10 px-4">
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

export default Product;

