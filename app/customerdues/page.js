"use client";
import React, { useState, useEffect } from "react";
import { numberWithCommaISO } from "@/lib/utils";
import { getDataFromFirebase } from "@/lib/firebaseFunction";

import 'jspdf-autotable';
import { sortArray } from "@/lib/utils";



const Customerdues = () => {
    const [customersData, setCustomersData] = useState([]);

    const loadData = async () => {
        const year = sessionStorage.getItem('y');
        try {
            const [customers, payments, sales] = await Promise.all([
                getDataFromFirebase("customer"),
                getDataFromFirebase("payment"),
                getDataFromFirebase("sale"),
            ]);



            const balanceByCustomer = customers.map(customer => {

                const matchSales = sales.filter(item => item.customerId === customer.id && item.yr === Number(year));
                const matchPayments = payments.filter(item => item.customerId === customer.id);

                const totalStale = matchSales.reduce((t, c) => t + (c.qty * c.price), 0);
                const totalPayment = matchPayments.reduce((t, c) => t + c.amount, 0);
                const balance = totalStale - totalPayment;

                return {
                    ...customer,
                    balance
                }
            })


            const sortedData = balanceByCustomer.sort((a, b) => sortArray(a.name, b.name));
            console.log(sortedData);
            setCustomersData(sortedData);
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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Customer Dues</h1>
                <p className="w-full text-center text-blue-300"></p>
            </div>

            <div className="w-full p-4 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-1">Customer Name</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Business Name</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Address</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Mobile</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Total Dues</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customersData.length ? (
                            customersData.map(customer => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={customer.id}>
                                    <td className="text-start py-1 px-4">{customer.name}</td>
                                    <td className="text-start py-1 px-4">{customer.businessName}</td>
                                    <td className="text-start py-1 px-4">{customer.address}</td>
                                    <td className="text-center py-1 px-4">{customer.mobile}</td>
                                    <td className="text-end py-1 px-4">{numberWithCommaISO(customer.balance)}</td>
                                </tr>
                            ))
                        ) : null}
                    </tbody>
                </table>
            </div>
        </>
    );

};

export default Customerdues;

