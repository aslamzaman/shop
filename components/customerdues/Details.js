import React, { useState } from "react";
import { numberWithCommaISO } from "@/lib/utils";
import { sortArray } from "@/lib/utils";




const Details = ({ message, id, data }) => {
    const [customers, setCustomers] = useState([]);
    const [sales, setSales] = useState([]);
    const [payments, setPayments] = useState([]);

    const [saleTotal, setSaleTotal] = useState("0");
    const [paymentTotal, setPaymentTotal] = useState("0");
    const [balanceTotal, setBalanceTotal] = useState("0");


    const [show, setShow] = useState(false);


    const showEditForm = () => {
        setShow(true);
        console.log(id, data)
        const { matchSales, matchPayments, totalStale, totalPayment, balance } = data;

        const sortSale = matchSales.sort((a, b) => sortArray(new Date(b.dt), new Date(a.dt)));
        const sortPayment = matchPayments.sort((a, b) => sortArray(new Date(b.dt), new Date(a.dt)));
        
        setCustomers(data);
        setSales(sortSale);
        setPayments(sortPayment);

        //---------------------------
        setSaleTotal(totalStale);
        setPaymentTotal(totalPayment);
        setBalanceTotal(balance);



    };


    const closeAddForm = () => {
        setShow(false);
    }


    return (
        <>
            {show && (

                <div className="fixed left-0 top-[60px] right-0 bottom-0 p-4 bg-gray-500/50 z-10 overflow-auto">
                    <div className="w-full lg:w-3/4 mx-auto my-8 bg-white border-2 border-gray-300 rounded-md shadow-md duration-500">
                        <div className="p-4 flex justify-between items-center border-b border-gray-300 rounded-t-md">         
                            <h1 className="text-xl font-bold text-blue-600">Customer Details</h1>
                            <button onClick={closeAddForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4 border-0 text-black">

                            <div className="w-full mb-12 p-4 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                            <p className="text-start">
                                Name: <strong>{customers.name}</strong><br />
                                Business Name: {customers.businessName}<br />
                                Address: {customers.address}<br />
                                Mobile: {customers.mobile}<br />
                                <strong>Balance Amount: {numberWithCommaISO(customers.balance)}</strong>
                            </p>
                            </div>



                            <div className="w-full p-4 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                                <h1 className="w-full py-2 text-xl font-bold text-center text-blue-700 underline">Sales details</h1>
                                <p className="w-full py-2 text-md  text-center text-black">Total Amount: {numberWithCommaISO(saleTotal)}</p>

                                <table className="w-full border border-gray-200">
                                    <thead>
                                        <tr className="w-full bg-gray-200">
                                            <th className="text-center border-b border-gray-200 px-4 py-1">SL</th>
                                            <th className="text-center border-b border-gray-200 px-4 py-1">Data</th>
                                            <th className="text-center border-b border-gray-200 px-4 py-1">Thaan</th>
                                            <th className="text-center border-b border-gray-200 px-4 py-1">Meter</th>
                                            <th className="text-center border-b border-gray-200 px-4 py-1">Price</th>
                                            <th className="text-end border-b border-gray-200 px-4 py-1">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales.length ? (
                                            sales.map((sale, i) => (
                                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={sale.id}>
                                                    <td className="text-center py-1 px-4">{i+1}.</td>
                                                    <td className="text-center py-1 px-4">{sale.dt}</td>
                                                    <td className="text-center py-1 px-4">{sale.shadeNo}</td>
                                                    <td className="text-center py-1 px-4">{sale.qty}</td>
                                                    <td className="text-center py-1 px-4">{sale.price}</td>
                                                    <td className="text-end py-1 px-4">{numberWithCommaISO((sale.qty * sale.price))}</td>
                                                </tr>
                                            ))
                                        ) : null}
                                    </tbody>
                                </table>

                            </div>


                            <div className="w-full mt-12 p-4 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                                <h1 className="w-full py-2 text-xl font-bold text-center text-blue-700 underline">Payment details</h1>
                                <p className="w-full py-2 text-md  text-center text-black">Total Amount: {numberWithCommaISO(paymentTotal)}</p>

                                <table className="w-full border border-gray-200">
                                    <thead>
                                        <tr className="w-full bg-gray-200">
                                            <th className="text-center border-b border-gray-200 px-4 py-1">SL</th>
                                            <th className="text-center border-b border-gray-200 px-4 py-1">Data</th>
                                            <th className="text-center border-b border-gray-200 px-4 py-1">Payment Type</th>      
                                            <th className="text-end border-b border-gray-200 px-4 py-1">Total</th>
                                            <th className="text-start border-b border-gray-200 px-4 py-1">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.length ? (
                                            payments.map((payment, i) => (
                                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={payment.id}>
                                                    <td className="text-center py-1 px-4">{i+1}.</td>
                                                    <td className="text-center py-1 px-4">{payment.dt}</td>
                                                    <td className="text-center py-1 px-4">{payment.cashType}</td>
                                                    <td className="text-end py-1 px-4">{numberWithCommaISO(payment.amount)}</td>
                                                    <td className="text-start py-1 px-4">{payment.remarks}</td>
                                                </tr>
                                            ))
                                        ) : null}
                                    </tbody>
                                </table>

                            </div>


                            <div className="w-full mt-12 p-4 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                                <h1 className="w-full py-2 text-xl font-bold text-center text-blue-700 underline">balance</h1>
                                <p className="w-full py-2 text-md  text-center text-black">Total Amount: {numberWithCommaISO(balanceTotal)}</p>
                            </div>


                            <div className="w-full mt-4 flex justify-start pointer-events-auto">
                                <input type="button" onClick={closeAddForm} value="Close" className="bg-pink-600 hover:bg-pink-800 text-white text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 cursor-pointer" />
                            </div>

                        </div>
                    </div>
                </div>






            )}
            <button onClick={showEditForm} title="Edit" className="px-1 py-1 hover:bg-teal-300 rounded-md transition duration-500 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-8 h-6 stroke-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </>
    )
}
export default Details;






