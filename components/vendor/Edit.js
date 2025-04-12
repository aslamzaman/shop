import React, { useState } from "react";
import { TextEn, BtnSubmit } from "@/components/Form";
import { updateDataToFirebase } from "@/lib/firebaseFunction";
import { vendorSchema } from "@/lib/Schema";
import LoadingDot from "../LoadingDot";



const Edit = ({ message, id, data }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [userId, setUserId] = useState('');


    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);

    const showEditForm = () => {
        setShow(true);
        const { name, email, address, phone, userId } = data;
        setName(name);
        setEmail(email);
        setAddress(address);
        setPhone(phone);
        setUserId(userId);
    };


    const closeEditForm = () => {
        setShow(false);
    };



    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            setBusy(true);
            // 5 objects ------
            const arrayObject = [name, email, address, phone, userId];
            const data = vendorSchema(arrayObject);
            const msg = await updateDataToFirebase("vendor", id, data);
            message(msg);
        } catch (error) {
            console.error("Error saving vendor data:", error);
            message("Error saving vendor data.");
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
                        <div className="px-4 py-2 flex justify-between items-center border-b border-gray-300">
                            <h1 className="text-xl font-bold text-blue-600">Edit Existing Data</h1>
                            <button onClick={closeEditForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>
                        <div className="px-4 pb-6 text-black">
                            <form onSubmit={saveHandler} >
                                <div className="grid grid-cols-1 gap-2 my-4">
                                    <TextEn Title="Name" Id="name" Change={e => setName(e.target.value)} Value={name} Chr={50} />
                                    <TextEn Title="Email" Id="email" Change={e => setEmail(e.target.value)} Value={email} Chr={50} />
                                    <TextEn Title="Address" Id="address" Change={e => setAddress(e.target.value)} Value={address} Chr={50} />
                                    <TextEn Title="Phone" Id="phone" Change={e => setPhone(e.target.value)} Value={phone} Chr={50} />
                                </div>
                                <div className="w-full mt-4 flex justify-start pointer-events-auto">
                                    <input type="button" onClick={closeEditForm} value="Close" className="bg-pink-600 hover:bg-pink-800 text-white text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 cursor-pointer" />
                                    <BtnSubmit Title="Save" Class="bg-blue-600 hover:bg-blue-800 text-white" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={showEditForm} title="Edit" className="px-1 py-1 hover:bg-teal-300 rounded-md transition duration-500 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 stroke-black hover:stroke-blue-800 transition duration-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
            </button>
        </>
    )
}
export default Edit;






