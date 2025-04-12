"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/moneyreceipt/Add";
import Delete from "@/components/moneyreceipt/Delete";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { formatedDate, inwordEnglish, numberWithComma, numberWithCommaISO, sortArray, titleCamelCase } from "@/lib/utils";
import { jsPDF } from "jspdf";

const Moneyreceipt = () => {
    const [moneyreceipts, setMoneyreceipts] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const userId = sessionStorage.getItem('user');
                const data = await getDataFromFirebase("moneyreceipt", userId);
                const sortedData = data.sort((a, b) => sortArray(new Date(b.createdAt), new Date(a.createdAt)));
                console.log(sortedData);
                setMoneyreceipts(sortedData);
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




    const printHandler = (id) => {
        try {
            const data = moneyreceipts.find(d => d.id === id);
            console.log(id, data);

            //------------------------------------------------------------------------
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
                putOnlyUsedFonts: true,
                floatPrecision: 16 // or "smart", default is 16
            });
            doc.addImage(`/images/moneyreceipt/${data.cash === 'cash' ? 'cash.png' : 'cheque.png'}`, "PNG", 0, 0, 210, 297);


            doc.setFont("times", "normal");
            doc.setFontSize(11);
            doc.text(`${data.refNo}`, 50, 68.5, { align: "left" });
            doc.text(`${formatedDate(data.dt)}`, 155, 68.5, { align: "left" });
            doc.text(`${data.whom}`, 120, 74, { align: "center" });
            const total = inwordEnglish(data.amount);

            doc.text(`${titleCamelCase(total)} Only`, 109, 80.25, { align: "center" });
            doc.text(`${data.cash === 'cash' ? '' : data.bank}`, 121, 87, { align: "center" });
            doc.text(`${data.cash === 'cash' ? '' : data.bankDt}`, 164.5, 87, { align: "left" });

            doc.text(`${data.purpose}`, 92, 93, { align: "center" });
            doc.text(`${data.contact}`, 165, 93, { align: "center" });
            doc.setFont("times", "bold");
            doc.text(`${numberWithComma(data.amount, true)}`, 51, 101, { align: "center" });

            doc.save(`${new Date().toISOString()}_Money_Receipt.pdf`);
        } catch (error) {
            console.log(error);
        }
    }




    return (
        <>
            <div className="w-full py-4">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Money Receipt</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>


            <div className="w-full p-4 mt-8 border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-center border-b border-gray-200 px-4 py-1">Ref.No</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Date</th>
                            <th className="text-start border-b border-gray-200 px-4 py-1">ReceivedFrom</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Amount</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Cash/Cheque</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Contact</th>
                            <th className="font-normal flex justify-end border-b border-gray-200 px-4 py-1">
                                <Add message={messageHandler} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {moneyreceipts.length ? (
                            moneyreceipts.map(moneyreceipt => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={moneyreceipt.id}>
                                    <td className="text-center py-1 px-4">{moneyreceipt.refNo}</td>
                                    <td className="text-center py-1 px-4">{formatedDate(moneyreceipt.dt)}</td>
                                    <td className="text-start py-1 px-4">{moneyreceipt.whom}</td>
                                    <td className="text-center py-1 px-4">{moneyreceipt.amount}</td>
                                    <td className="text-center py-1 px-4">{moneyreceipt.cash === 'cash' ? 'Cash' : 'Cheque'}</td>
                                    <td className="text-center py-1 px-4">{moneyreceipt.contact}</td>
                                    <td className="text-center py-2">
                                        <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">

                                            <button onClick={() => printHandler(moneyreceipt.id)} className="w-5 h-5 cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                                                </svg>
                                            </button>




                                            <Delete message={messageHandler} id={moneyreceipt.id} data={moneyreceipt} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={12} className="text-center py-10 px-4">
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

export default Moneyreceipt;

