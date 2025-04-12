import React, { useState } from "react";
import { BtnSubmit, TextDt, DropdownEn, TextNum } from "@/components/Form";
import { addDataToFirebase, getDataFromFirebase } from "@/lib/firebaseFunction";
import { paymentSchema } from "@/lib/Schema";
import LoadingDot from "../LoadingDot";
import { formatedDate } from "@/lib/utils";

const Add = ({ message }) => {
    const [customerId, setCustomerId] = useState('');
    const [dt, setDt] = useState('');
    const [cash, setCash] = useState('');
    const [amount, setAmount] = useState('');



    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);

    const [customers, setCustomers] = useState([]);



    const showAddForm = async () => {
        setShow(true);
        resetVariables();
        try {
            const userId = sessionStorage.getItem('user');
            const responseCustomer = await getDataFromFirebase("customer", userId);
            setCustomers(responseCustomer);
        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }
    }


    const closeAddForm = () => {
        setShow(false);
    }


    const resetVariables = () => {
        setCustomerId('');
        setDt(formatedDate(new Date()));
        setCash('Cash');
        setAmount('');
    }



    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            setBusy(true);
            // 5 objects ------
            const userId = sessionStorage.getItem('user');
            const arrayObject = [customerId, dt, cash, amount, userId];
            const data = paymentSchema(arrayObject);
            const msg = await addDataToFirebase("payment", data);
            message(msg);
        } catch (error) {
            console.error("Error saving payment data:", error);
            message("Error saving payment data.");
        } finally {
            setBusy(false);
            setShow(false);
        }
    }


    return (
        <>
            {busy ? <LoadingDot message="Please wait" /> : null}
            {show && (
                <div className="fixed left-0 top-[60px] right-0 bottom-0 p-4 bg-gray-500/50 z-10 overflow-auto">
                    <div className="w-full lg:w-3/4 mx-auto my-8 bg-white border-2 border-gray-300 rounded-md shadow-md duration-500">
                        <div className="p-4 flex justify-between items-center border-b border-gray-300 rounded-t-md">
                            <h1 className="text-xl font-bold text-blue-600">Add New Data</h1>
                            <button onClick={closeAddForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 border-0 text-black">
                            <div className="w-full overflow-auto">
                                <div className="p-4">
                                    <form onSubmit={saveHandler}>
                                        <div className="grid grid-cols-1 gap-4">
                                            <DropdownEn Title="Customer" Id="customerId" Change={e => setCustomerId(e.target.value)} Value={customerId}>
                                                {customers.length ? customers.map(customer => <option value={customer.id} key={customer.id}>{customer.name}</option>) : null}
                                            </DropdownEn>
                                            <TextDt Title="Date" Id="dt" Change={e => setDt(e.target.value)} Value={dt} />
                                            <DropdownEn Title="Cash" Id="cash" Change={e => setCash(e.target.value)} Value={cash}>
                                                <option value="Cash">Cash</option>
                                                <option value="Cheque">Cheque</option>
                                            </DropdownEn>
                                            <TextNum Title="Amount" Id="amount" Change={e => setAmount(e.target.value)} Value={amount} />
                                        </div>
                                        <div className="w-full mt-4 flex justify-start pointer-events-auto">
                                            <input type="button" onClick={closeAddForm} value="Close" className="bg-pink-600 hover:bg-pink-800 text-white text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 cursor-pointer" />
                                            <BtnSubmit Title="Save" Class="bg-blue-600 hover:bg-blue-800 text-white" />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={showAddForm} className="px-1 py-1 bg-blue-500 hover:bg-blue-700 rounded-md transition duration-500 cursor-pointer" title="Add New">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-7 h-7 stroke-white hover:stroke-gray-100">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </>
    )
}
export default Add;

