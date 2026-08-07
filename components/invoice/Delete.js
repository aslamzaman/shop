import React, { useState } from "react";
import { BtnEn } from "@/components/Form";
import { localStorageDeleteItem } from "@/lib/DatabaseLocalStorage";

const Delete = ({ message, id, data }) => {
    const [productId, setProductId] = useState("");
    const [show, setShow] = useState(false);

    const showDeleteForm = () => {
        setShow(true);
        try {
            const { productId } = data;
            setProductId(productId);
        }
        catch (err) {
            console.log(err);
        }
    }


    const closeDeleteForm = () => {
        setShow(false);
    }


    const deleteYesClick =    () => {
        try {
            const msg =  localStorageDeleteItem('invoice', id);
            message(msg);
        } catch (error) {
            console.log(error);
            message("Data deleting error");
        }
        setShow(false);
    }


    return (
        <>
            {show && (
                <div className="fixed inset-0 px-2 py-16 bg-gray-500/50 z-10 overflow-auto">
                    <div className="w-full md:w-[500px] lg:w-[800px] mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">
                        <div className="px-6 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">
                            <h1 className="text-xl font-bold text-blue-600">Delete Existing Data</h1>
                            <button onClick={closeDeleteForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>
                        <div className="p-4 lg:p-6 flex flex-col space-y-4">
                            <div className="w-full">
                                <svg height="60" width="60" xmlns="http://www.w3.org/2000/svg" className="bg-white-100 mx-auto">
                                    <path d="M30 3 L3 57 L57 57 Z" className="fill-none stroke-red-700 stroke-[5px]" />
                                    <path d="M30 23 L30 40" className="fill-none stroke-red-700 stroke-[5px]" />
                                    <path d="M30 45 L30 50" className="fill-none stroke-red-700 stroke-[5px]" />
                                </svg>

                                <h1 className="text-sm text-center text-gray-600 mt-4">
                                    Are you sure to proceed with the deletion?</h1>
                                <h1 className="text-center text-gray-600 font-bold">{productId}</h1>
                            </div>
                            <div className="w-full flex justify-start">
                                <BtnEn Title="Close" Click={closeDeleteForm} Class="bg-pink-700 hover:bg-pink-900 text-white mr-1" />
                                <BtnEn Title="Yes Delete" Click={deleteYesClick} Class="bg-blue-600 hover:bg-blue-800 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={showDeleteForm} title="Delete" className="px-1 py-1 hover:bg-red-300 rounded-md transition duration-500 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 stroke-black hover:stroke-blue-800 transition duration-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </>
    )
}
export default Delete;
  
