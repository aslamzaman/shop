import React, { useState } from "react";
import { TextEn, BtnSubmit, TextDt, TextNum, DropdownEn } from "@/components/Form";
import { addDataToFirebase } from "@/lib/firebaseFunction";
import { moneyreceiptSchema } from "@/lib/Schema";
import LoadingDot from "../LoadingDot";
import { formatedDate } from "@/lib/utils";

const Add = ({ message }) => {
    const [refNo, setRefNo] = useState('');
    const [dt, setDt] = useState('');
    const [whom, setWhom] = useState('');
    const [amount, setAmount] = useState('');
    const [cash, setCash] = useState('');
    const [cheque, setCheque] = useState('');
    const [bank, setBank] = useState('');
    const [bankDt, setBankDt] = useState('');
    const [purpose, setPurpose] = useState('');
    const [contact, setContact] = useState('');
    const [userId, setUserId] = useState('');


    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);
    const [isCash, setIsCash] = useState(true);



    const showAddForm = () => {
        resetVariables();
        setShow(true);
    }


    const closeAddForm = () => {
        setShow(false);
    }


    const resetVariables = () => {
        setDt(formatedDate(new Date()));
        setWhom('');
        setAmount('');
        setCash('cash');
        setCheque('1');
        setBank('BankString');
        setBankDt(formatedDate("1970-01-01"));
        setPurpose('');
        setContact('');
        setIsCash(true);
    }



    const saveHandler = async (e) => {
        e.preventDefault();
        const refNo = Math.round(Date.now() / 1000);
        const userId = sessionStorage.getItem('user');
        try {
            setBusy(true);
            // 11 objects ------
            const arrayObject = [refNo, dt, whom, amount, cash, cheque, bank, bankDt, purpose, contact, userId];
            const data = moneyreceiptSchema(arrayObject);
            const msg = await addDataToFirebase("moneyreceipt", data);
            message(msg);
        } catch (error) {
            console.error("Error saving moneyreceipt data:", error);
            message("Error saving moneyreceipt data.");
        } finally {
            setBusy(false);
            setShow(false);
        }
    }




    const cashChangeHandler = (e) => {
        const event = e.target.value;
        setCash(event);
        if (event === "cash") {
            setIsCash(true);
            setCheque('1');
            setBank('BankString');
            setBankDt(formatedDate("1970-01-01"));
        } else {
            setIsCash(false);
            setCheque('');
            setBank('');
            setBankDt(formatedDate(new Date()));
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
                                        <div className="grid grid-cols-1 gap-2">
                                            <TextDt Title="Date" Id="dt" Change={e => setDt(e.target.value)} Value={dt} />
                                            <TextEn Title="Received From" Id="whom" Change={e => setWhom(e.target.value)} Value={whom} Chr={70} />
                                            <TextNum Title="Amount" Id="amount" Change={e => setAmount(e.target.value)} Value={amount} />

                                            <DropdownEn Title="Cash" Id="cash" Change={cashChangeHandler} Value={cash}>
                                                <option value="cash">Cash</option>
                                                <option value="cheq">Cheque</option>
                                            </DropdownEn>
                                            {!isCash ? (<>
                                                <TextEn Title="Cheque Number" Id="cheque" Change={e => setCheque(e.target.value)} Value={cheque} Chr={50} />
                                                <TextEn Title="Bank Name" Id="bank" Change={e => setBank(e.target.value)} Value={bank} Chr={50} />
                                                <TextDt Title="Cheque Date" Id="bankDt" Change={e => setBankDt(e.target.value)} Value={bankDt} />
                                            </>) : null}

                                            <TextEn Title="Purpose" Id="purpose" Change={e => setPurpose(e.target.value)} Value={purpose} Chr={50} />
                                            <TextEn Title="Contact" Id="contact" Change={e => setContact(e.target.value)} Value={contact} Chr={50} />
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

