import React, { useState } from "react";
import { BtnEn } from "@/components/Form";
import { deleteDataFromFirebase } from "@/lib/firebaseFunction";
import LoadingDot from "../LoadingDot";


const Delete = ({ message, id, data }) => {
    const [name, setName] = useState("");

    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);


    const showDeleteForm = () => {
        setShow(true);
        const { name } = data;
        setName(name);
    }


    const closeDeleteForm = () => {
        setShow(false);
    }


    const deleteClick = async () => {
        try {
            setBusy(true);
            const msg = await deleteDataFromFirebase('product', id);
            message(msg);
        } catch (error) {
            console.log(error);
            message("Data deleting error");
        } finally {
            setBusy(false);
            setShow(false);
        }
    }



    return (
        <>
            {busy ? <LoadingDot message="Please wait" /> : null}
            {show && (
                <div className="fixed left-0 top-[60px] right-0 bottom-0 p-4 bg-gray-500/75 z-10 overflow-auto">
                    <div className="w-full lg:w-3/4 mx-auto my-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-500">
                        <div className="px-4 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">
                            <h1 className="text-xl font-bold text-blue-600">Delete Existing Data</h1>
                            <button onClick={closeDeleteForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>
                        <div className="p-4 flex flex-col space-y-4">
                            <div className="w-full">
                                <svg height="60" width="60" xmlns="http://www.w3.org/2000/svg" className="bg-white-100 mx-auto">
                                    <path d="M30 3 L3 57 L57 57 Z" className="fill-none stroke-red-700 stroke-[5px]" />
                                    <path d="M30 23 L30 40" className="fill-none stroke-red-700 stroke-[5px]" />
                                    <path d="M30 45 L30 50" className="fill-none stroke-red-700 stroke-[5px]" />
                                </svg>

                                <h1 className="text-sm text-center text-gray-600 mt-4">
                                    Are you sure to proceed with the deletion?</h1>
                                <h1 className="text-center text-gray-600 font-bold">{name}</h1>
                            </div>
                            <div className="w-full mt-4 flex justify-start pointer-events-auto">
                                <BtnEn Title="Close" Click={closeDeleteForm} Class="bg-pink-700 hover:bg-pink-900 text-white mr-1" />
                                <BtnEn Title="Yes Delete" Click={deleteClick} Class="bg-blue-600 hover:bg-blue-800 text-white" />
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


