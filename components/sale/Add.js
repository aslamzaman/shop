import React, { useState } from "react";
import { BtnSubmit, TextDt, TextNum, DropdownEn, TextEn, TextEnDisabled } from "@/components/Form";
import { addDataToFirebase, getDataFromFirebase } from "@/lib/firebaseFunction";
import LoadingDot from "../LoadingDot";
import { formatedDate, localStorageGetItem, delay, numberWithCommaISO, localStorageDeleteItem } from "@/lib/utils";
import AddItem from "./AddItem";
import { useRouter } from "next/navigation";
import { stockBalance } from "@/helpers/saleHelpers";




const Add = ({ message }) => {
    const [invoice, setInvoice] = useState("");
    const [dt, setDt] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [deduct, setDeduct] = useState('');
    const [payment, setPayment] = useState('');
    const [tax, setTax] = useState('');



    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);

    const [total, setTotal] = useState('0');


    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [localItems, setLocalItems] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [msg, setMsg] = useState("");

    const router = useRouter();


    const loadLocalData = async () => {
        const localData = localStorageGetItem('localItem');
        const { purchaseData } = await stockBalance();

        const result = localData.map((local, i) => {
            const matchPurchase = purchaseData.find(purchase => purchase.id === local.purchaseId);
            const subTotal = parseFloat(matchPurchase.salePrice) * parseFloat(local.qty);
            return {
                ...local,
                sl: (i + 1),
                product: matchPurchase.product,
                salePrice: matchPurchase.salePrice,
                matchPurchase,
                subTotal
            }
        })

        const total = result.reduce((t, c) => t + parseFloat(c.subTotal), 0);
        return { result, total };

    }


    const showAddForm = async () => {
        setShow(true);
        resetVariables();
        try {
            const { customers, products } = await stockBalance();
            setCustomers(customers);
            setProducts(products);
            //-------------------------
            const { result, total } = await loadLocalData();
            setLocalItems(result);
            setTotal(total);
        } catch (error) {
            console.log(error);
        }
    }


    const closeAddForm = () => {
        setShow(false);
    }


    const resetVariables = () => {
        const autoInvoice = Math.round(Date.now() / 1000);
        setInvoice(autoInvoice);
        setDt(formatedDate(new Date()));
        setCustomerId('');
        setDeduct('0');
        setPayment('0');
        setTax('0');
    }



    const saveHandler = async (e) => {
        e.preventDefault();
        const localItems = localStorageGetItem("localItem");
        if (localItems.length < 1) {
            setMsg("You have not added any products.!");
            return false;
        }
        //--------Create Object-----------------
        let data = [];
        const userId = sessionStorage.getItem('user');
        for (let i = 0; i < localItems.length; i++) {
            data.push({
                invoice: invoice,
                dt: dt,
                customerId: customerId,
                deduct: i === 0 ? deduct : 0,
                payment: i === 0 ? payment : 0,
                tax: i === 0 ? tax : 0,
                userId: userId,
                purchaseId: localItems[i].purchaseId,
                qty: localItems[i].qty,
                createdAt: new Date().toISOString()
            });
            await delay(10);
        }
        setBusy(true);
        //------- Save data to firebase ------------
        try {
            for (let i = 0; i < data.length; i++) {
                const msg = await addDataToFirebase("sale", data[i]);
                // console.log(msg);
                await delay(50);
            }
            message(`A total of ${data.length} data have been saved.`);
            localStorage.removeItem("localItem");
            setBusy(false);
            setShow(false);
        } catch (error) {
            console.error("Error saving sale data:", error);
        }
    }

    //--------------------------------------


    const messageHandler = async (data) => {
        setMsg(data);
        const { result, total } = await loadLocalData();
        setLocalItems(result);
        setTotal(total);
    }


    const removeLocalItemHandeler = async (id) => {
        const deleteData = localStorageDeleteItem('localItem', id);
        const { result, total } = await loadLocalData();
        setLocalItems(result);
        setTotal(total)
        setMsg(deleteData);
    }



    return (
        <>
            {busy ? <LoadingDot message="Please wait" /> : null}
            {show && (
                <div className="fixed left-0 top-[60px] right-0 bottom-0 p-4 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">
                    <div className="w-full lg:w-9/12  mx-auto my-6 bg-white border-2 border-gray-300 rounded-md shadow-md duration-500">
                        <div className="px-4 md:px-6 py-4 flex justify-between items-center border-b border-gray-300 rounded-t-md">
                            <h1 className="text-xl font-bold text-blue-600">Add New Data</h1>
                            <button onClick={closeAddForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 pb-6 border-0 text-black">
                            <h1 className="w-full text-center text-blue-600">{msg}</h1>
                            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-1 overflow-auto">

                                <div className="px-4">
                                    <form onSubmit={saveHandler}>
                                        <div className="grid grid-cols-1 gap-1">
                                            <TextEnDisabled Title="Auto Invoice" Id="invoice" Change={e => setInvoice(e.target.value)} Value={invoice} Chr={15} />
                                            <TextDt Title="Date" Id="dt" Change={e => setDt(e.target.value)} Value={dt} />

                                            <DropdownEn Title="Customer" Id="customerId" Change={e => setCustomerId(e.target.value)} Value={customerId}>
                                                {customers.length ? customers.map(customer => <option value={customer.id} key={customer.id}>{customer.name} - {customer.address}</option>) : null}
                                            </DropdownEn>
                                            <TextNum Title="Payment" Id="unit" Change={e => setPayment(e.target.value)} Value={payment} />
                                            <TextNum Title="Deduct" Id="deduct" Change={e => setDeduct(e.target.value)} Value={deduct} />
                                            <TextNum Title="Tax" Id="tax" Change={e => setTax(e.target.value)} Value={tax} />
                                        </div>
                                        <div className="w-full mt-2 flex justify-start pointer-events-auto">
                                            <input type="button" onClick={closeAddForm} value="Close" className="bg-pink-600 hover:bg-pink-800 text-white text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 cursor-pointer" />
                                            <BtnSubmit Title="Save" Class="bg-blue-600 hover:bg-blue-800 text-white" />
                                        </div>
                                    </form>
                                </div>


                                <div className="col-span-2 font-normal">
                                    <h1 className="w-full text-center text-3xl text-blue-600 font-bold">{numberWithCommaISO(total)}</h1>
                                    <table className="w-full border border-gray-200">
                                        <thead>
                                            <tr className="w-full bg-gray-200">
                                                <th className="text-center border-b border-gray-200 px-4 py-1">SL</th>
                                                <th className="text-start border-b border-gray-200 px-4 py-1">Item</th>
                                                <th className="text-end border-b border-gray-200 px-4 py-1">Quantity</th>
                                                <th className="text-end border-b border-gray-200 px-4 py-1">Rate</th>
                                                <th className="text-end border-b border-gray-200 px-4 py-1">Total</th>
                                                <th className="w-[95px] border-b border-gray-200 px-4 py-2">
                                                    <div className="w-[90px] h-[45px] flex justify-end space-x-2 p-1 font-normal">
                                                        <AddItem message={messageHandler} />
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {localItems.length ? (
                                                localItems.map(local => (
                                                    <tr className="border-b border-gray-200 hover:bg-gray-100" key={local.id}>
                                                        <td className="text-center py-1 px-4">{local.sl}</td>
                                                        <td className="text-start py-1 px-4">{local.product}</td>
                                                        <td className="text-end py-1 px-4">{numberWithCommaISO(local.qty)}</td>
                                                        <td className="text-end py-1 px-4">{numberWithCommaISO(local.salePrice)}</td>
                                                        <td className="text-end py-1 px-4">{numberWithCommaISO(local.subTotal)}</td>
                                                        <td className="text-center py-2">
                                                            <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                                                <button onClick={() => removeLocalItemHandeler(local.id)} className="w-7 h-7 p-0.5 mr-4 bg-gray-50 hover:bg-gray-300 rounded-md">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
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

                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={showAddForm} className="px-1 py-1 bg-blue-500 hover:bg-blue-700 rounded-md transition duration-500" title="Add New">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-7 h-7 stroke-white hover:stroke-gray-100">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </>
    )
}
export default Add;

