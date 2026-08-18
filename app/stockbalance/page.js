"use client";
import React, { useState, useEffect } from "react";
import { numberWithCommaISO } from "@/lib/utils";
import { getDataFromFirebase } from "@/lib/firebaseFunction";

import 'jspdf-autotable';
import { sortArray } from "@/lib/utils";



const Purchasesale = () => {
    const [stocks, setStocks] = useState([]);

    const loadData = async () => {
        const year = sessionStorage.getItem('y');
        try {
            const [vendors, customers, products,  purchases, sales] = await Promise.all([
                getDataFromFirebase("vendor"),
                getDataFromFirebase("customer"),
                getDataFromFirebase("product"),
                getDataFromFirebase("purchase"),
                getDataFromFirebase("sale")
            ]);

                       
            console.log("products", products)
            console.log("sales", sales)
            const balanceByProduct = products.map(product =>{
                const matchPurchases = purchases.filter(item => item.productId === product.id && item.yr === Number(year))
                const totalPurchase = matchPurchases.reduce((t, c) => t + c.qty, 0);
                const totalPurchaseTaka = matchPurchases.reduce((t, c) => t + (c.qty * c.price), 0);
                const totalPurchaseShade = matchPurchases.reduce((t, c) => t + Number(c.shadeNo), 0);

                const matchSales = sales.filter(item => item.productId === product.id && item.yr === Number(year))
                const totalSale = matchSales.reduce((t, c) => t + c.qty, 0);
                const totalSaleTaka = matchSales.reduce((t, c) => t + (c.qty * c.price), 0);
                const totalSaleShade = matchSales.reduce((t, c) => t + Number(c.shadeNo), 0);

                const productBalance = totalPurchase - totalSale
                const takaBalance = totalPurchaseTaka - totalSaleTaka
                const shadeBalance = totalPurchaseShade - totalSaleShade
                return{
                    ...product,
                    productBalance,
                    takaBalance,
                    shadeBalance
                }
            })
            const sortedData = balanceByProduct.sort((a, b) => sortArray(a.name, b.name));
            setStocks(sortedData)

        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        loadData()
    }, []);



    return (
        <>
            <div className="w-full py-4">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Stock/Balance</h1>
                <p className="w-full text-center text-blue-300"></p>
            </div>

            <div className="w-full p-4 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <h1 className="text-start text-2xl font-bold">Stock/Balance</h1>
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-1">Product Name</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Product Description</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Thaan</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Meter</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Total Taka</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.length ? (
                            stocks.map(stock => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={stock.id}>
                                    <td className="text-start py-1 px-4">{stock.name}</td>
                                    <td className="text-start py-1 px-4">{stock.description}</td>        
                                    <td className="text-end py-1 px-4">{stock.shadeBalance}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(stock.productBalance)}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(stock.takaBalance)}</td>             
                                </tr>
                            ))
                        ) : null}
                    </tbody>
                </table>
            </div>
        </>
    );

};

export default Purchasesale;

