"use client";
import React, { useState, useEffect } from "react";
import { BtnEn, DropdownEn } from "@/components/Form";
import Add from "@/components/sale/Add";
import Edit from "@/components/sale/Edit";
import Delete from "@/components/sale/Delete";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray, numberWithCommaISO, unique } from "@/lib/utils";



const Sale = () => {
    const [salesMain, setSalesMain] = useState([]);
    const [sales, setSales] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");
    const [headerMsg, setHeaderMsg] = useState("Data ready");

    const [customerId, setCustomerId] = useState('');
    const [customers, setCustomers] = useState([]);



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
                        customerId: matchCustomer ? matchCustomer.id : '',
                        product: matchProduct ? matchProduct.name : ''
                    }
                })
                console.log(join)
                const saleByYear = join.filter(s => s.yr === Number(year))
                console.log(saleByYear)
                const sortedData = saleByYear.sort((a, b) => sortArray(new Date(b.dt), new Date(a.dt)));
                console.log(sortedData);

                const sortedCustomer = customerResponse.sort((a, b) => sortArray(a.name, b.name));
                console.log("aslam3", sortedCustomer)
                setCustomers(sortedCustomer);

                setSales(sortedData);
                setSalesMain(sortedData);
                setWaitMsg('');

                // Header summery ----------------------------------------------------------


                const totalThaan = saleByYear.reduce((t, c) => t + Number(c.shadeNo), 0);
                const totalMeter = saleByYear.reduce((t, c) => t + Number(c.qty), 0);
                const totalAmount = saleByYear.reduce((t, c) => t + Number(c.qty) * Number(c.price), 0);
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



    const searchClick = async () => {
        try {
            const searchData = salesMain.filter(data => data.customerId === customerId);
            console.log(searchData);
            setSales(searchData)

        } catch (error) {
            console.log(error);
        }
    }

    const refreshClick = async () => {
        try {
            setSales(salesMain)
        } catch (error) {
            console.log(error);
        }
    }




    return (
        <>
            <div className="w-full py-4">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Sale</h1>
                <h1 className="w-full text-md font-bold text-center text-black">&nbsp;{headerMsg}&nbsp;</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>




            <div className="w-full p-4 mt-8 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <div className="w-full flex items-center space-x-4">
                    <div>
                        <DropdownEn Title="Customer" Id="customerId" Change={e => setCustomerId(e.target.value)} Value={customerId}>
                            {customers.length ? customers.map(customer => <option value={customer.id} key={customer.id}>{customer.name}-{customer.address}</option>) : null}
                        </DropdownEn>
                    </div>
                    <div className="w-full flex items-center space-x-4">
                        <BtnEn Title="Search" Click={searchClick} Class="bg-blue-600 hover:bg-blue-800 text-white" />
                        <BtnEn Title="Refresh" Click={refreshClick} Class="bg-green-600 hover:bg-green-800 text-white" />

                    </div>
                </div>
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

