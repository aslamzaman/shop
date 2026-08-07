"use client";
import React, { useState, useEffect } from "react";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";
import { invoicePDFPrint } from "@/lib/invoicePrint";
import { invoicePDFSchema } from "@/lib/Schema";


const Customer = () => {
    const [invoice_lists, setInvoice_lists] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    const [customersData, setCustomersData] = useState([]);
    const [productsData, setProductsData] = useState([]);


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {

                const [invoiceResponse, customerResponse, productResponse] = await Promise.all([
                    getDataFromFirebase("invoice"),
                    getDataFromFirebase("customer"),
                    getDataFromFirebase("product")  
                ]);

                const join = invoiceResponse.map(invoice => {
                    const matchCustomer = customerResponse.find(c => c.id === invoice.customerId);
                    const productList = invoice.products;
                    const bill = productList.reduce((t, c) => t + (c.qty * c.price), 0);
                    const payable = bill - invoice.payment - invoice.deduct;
                    return {
                        ...invoice,
                        customer: matchCustomer ? matchCustomer.name : '',
                        bill,
                        payable
                    }
                })
                console.log(join)

                const sortedData = join.sort((a, b) => sortArray(b.invoiceNo, a.invoiceNo));
                   console.log(sortedData);
                setInvoice_lists(sortedData);
                setCustomersData(customerResponse);
                setProductsData(productResponse);

                setWaitMsg('');
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getData();
    }, [msg]);


    


const cmdPrint = (id)=>{
    console.log(id);
    const {invoiceNo, dt, customerId, payment, deduct, yr, products} =  invoice_lists.find(item => item.id === id);

    const arrayData = [invoiceNo, dt, customerId, payment, deduct, yr, products]

    
    const data = invoicePDFSchema(arrayData);    
    console.log("aslam", data)
    invoicePDFPrint(data, customersData, productsData);
}



    return (
        <>
            <div className="w-full py-4">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Invoice List</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>


            <div className="w-full p-4 mt-8 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-1">Invoice</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">Customer</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Bill</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Payment</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Deduct</th>
                            <th className="text-end border-b border-gray-200 px-4 py-1">Balance</th>
                            <th className="font-normal flex justify-end border-b border-gray-200 px-4 py-1">
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {invoice_lists.length ? (
                            invoice_lists.map(invoice => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={invoice.id}>
                                    <td className="text-start py-1 px-4">{invoice.invoiceNo}</td>
                                    <td className="text-center py-1 px-4">{invoice.dt}</td>
                                    <td className="text-start py-1 px-4">{invoice.customer}</td>
                                    <td className="text-end py-1 px-4">{invoice.bill}</td>
                                    <td className="text-end py-1 px-4">{invoice.payment}</td>
                                    <td className="text-end py-1 px-4">{invoice.deduct}</td>
                                    <td className="text-end py-1 px-4">{invoice.payable}</td>
                                    <td className="text-center py-2">                           
                                        <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                          <button onClick={() =>cmdPrint(invoice.id)} className="text-center mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 bg-blue-600 hover:bg-blue-800 text-white cursor-pointer">Print</button>
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

export default Customer;

