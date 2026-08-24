"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/payments/Add";
import Edit from "@/components/payments/Edit";
import Delete from "@/components/payments/Delete";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";
import { numberWithCommaISO } from "@/lib/utils";



const Payment = () => {
    const [payments, setPayments] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");
    const [headerMsg, setHeaderMsg] = useState("Data ready");

    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const year = sessionStorage.getItem('y');
                const [paymentResponse, customerResponse] = await Promise.all([
                    getDataFromFirebase("payment"),
                    getDataFromFirebase("customer")
                ]);
                const join = paymentResponse.map(payment => {
                    const matchCustomer = customerResponse.find(c => c.id === payment.customerId);
                    return {
                        ...payment,
                        customer: matchCustomer ? matchCustomer.name : ''                        
                    }
                })
                const paymentByYear = join.filter(s => s.yr === Number(year))
                console.log(paymentByYear)
                const sortedData = paymentByYear.sort((a, b) => sortArray(new Date(b.dt), new Date(a.dt)));
                console.log(sortedData);
                setPayments(sortedData);
                setWaitMsg('');

                // Header summery ----------------------------------------------------------

                const totalAmount = paymentByYear.reduce((t, c)=> t + Number(c.amount), 0);                
                setHeaderMsg(`Amount = ${numberWithCommaISO(totalAmount)}`)



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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Payments</h1>
                <h1 className="w-full text-md font-bold text-center text-black">&nbsp;{headerMsg}&nbsp;</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>




            <div className="w-full p-4 mt-8 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">                           
                            <th className="text-start border-b border-gray-200 px-4 py-1">Customer</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Payment Type</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Amount</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Remark</th>
                            <th className="font-normal flex justify-end border-b border-gray-200 px-4 py-1">
                                <Add message={messageHandler} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length ? (                            
                            payments.map(payment => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={payment.id}>
                                    <td className="text-start py-1 px-4">{payment.customer}</td>
                                    <td className="text-center py-1 px-4">{payment.dt}</td>
                                    <td className="text-center py-1 px-4">{payment.cashType}</td>
                                    <td className="text-end py-1 px-4">{payment.amount}</td>
                                    <td className="text-start py-1 px-4">{(payment.remarks)}</td>
                                    <td className="text-center py-2">                                 
                                        <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                            <Edit message={messageHandler} id={payment.id} data={payment} />
                                            <Delete message={messageHandler} id={payment.id} data={payment} />
                                        </div>                                     
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10 px-4">
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

export default Payment;

