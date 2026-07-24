"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/vendor/Add";
import Edit from "@/components/vendor/Edit";
import Delete from "@/components/vendor/Delete";
import { getDataFromFirebase } from "@/lib/firebaseFunction";
import { sortArray } from "@/lib/utils";



const Vendor = () => {
    const [vendors, setVendors] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("Data ready");


    useEffect(() => {
        const getData = async () => {
            setWaitMsg('Please Wait...');
            try {
                const vendorResponse = await getDataFromFirebase("vendor");
                const sortedData = vendorResponse.sort((a, b) => sortArray(a.name, b.name));
                console.log(sortedData);
                setVendors(sortedData);
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
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Vendors</h1>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
                <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
            </div>

            <div className="w-full p-4 bg-white border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="w-full bg-gray-200">
                            <th className="text-start border-b border-gray-200 px-4 py-1">Name</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">B.Name</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Address</th>
                            <th className="text-center border-b border-gray-200 px-4 py-1">Mobile</th>
                            <th className="w-[95px] border-b border-gray-200 px-4 py-2">
                                <div className="w-[90px] h-[45px] flex justify-end space-x-2 p-1 font-normal">
                                    {/* <Print data={vendors} /> */}
                                    <Add message={messageHandler} />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.length ? (
                            vendors.map(vendor => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={vendor.id}>
                                    <td className="text-start py-1 px-4">{vendor.name}</td>
                                    <td className="text-center py-1 px-4">{vendor.businessName}</td>
                                    <td className="text-center py-1 px-4">{vendor.address}</td>
                                    <td className="text-center py-1 px-4">{vendor.mobile}</td>
                                    <td className="text-center py-2">                             
                                        <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                            <Edit message={messageHandler} id={vendor.id} data={vendor} />
                                            <Delete message={messageHandler} id={vendor.id} data={vendor} />
                                        </div>
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

export default Vendor;

