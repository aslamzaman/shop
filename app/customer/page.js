"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/customer/Add";
import Edit from "@/components/customer/Edit";
import Delete from "@/components/customer/Delete";
// import Print from "@/components/customer/Print";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";



const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");

    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const userId = sessionStorage.getItem('user');
                const [customerResponse, saleResponse] = await Promise.all([
                    getDataFromFirebase("customer",userId),
                    getDataFromFirebase("sale", userId)
                ]);


                const customerUpdateCheck = customerResponse.map(customer => {
                    const matchSale = saleResponse.filter(sale => sale.customerId === customer.id);
                    return {
                        ...customer,
                        isUpdatable: matchSale.length > 0 ? false : true
                    }
                })

                const sortedData = customerUpdateCheck.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
                console.log(sortedData);
                setCustomers(sortedData);
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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Customer</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>


            <div className="w-full p-4 border-2 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-1">Name</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Email</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Address</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Phone</th>
                            <th className="w-[95px] border-b border-gray-200 px-4 py-2">
                                <div className="w-[90px] h-[45px] flex justify-end space-x-2 p-1 font-normal">
                                    {/* <Print data={customers} /> */}
                                    <Add message={messageHandler} />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length ? (
                            customers.map(customer => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={customer.id}>
                                    <td className="text-start py-1 px-4">{customer.name}</td>
                                    <td className="text-center py-1 px-4">{customer.email}</td>
                                    <td className="text-center py-1 px-4">{customer.address}</td>
                                    <td className="text-center py-1 px-4">{customer.phone}</td>
                                    <td className="text-center py-2">
                                        {customer.isUpdatable ? (
                                            <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                                <Edit message={messageHandler} id={customer.id} data={customer} />
                                                <Delete message={messageHandler} id={customer.id} data={customer} />
                                            </div>
                                        ) : null}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 px-4">
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

export default Customer;

