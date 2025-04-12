import React, { useState } from "react";
import { BtnSubmit, DropdownEn, TextDt, TextNum } from "@/components/Form";
import { addDataToFirebase, getDataFromFirebase } from "@/lib/firebaseFunction";
import { saleSchema } from "@/lib/Schema";
import LoadingDot from "../LoadingDot";
import { delay, numberWithCommaISO } from "@/lib/utils";
import AddItem from "./AddItem";
import { localStorageDeleteItem, localStorageGetItem } from "@/lib/DatabaseLocalStorage";




const getLocalStorageData = async () => {
    const data = localStorageGetItem("localItem");

    const userId = sessionStorage.getItem('user');
    const [purchases, products] = await Promise.all([
        getDataFromFirebase("purchase", userId),
        getDataFromFirebase("product", userId),
    ]);

    const result = data.length > 0 ? data.map(local => {
        const matchPurchase = purchases.find(p => p.id === local.purchaseId);
        const matchProduct = products.find(p => p.id === matchPurchase.productId);
        const salePrice = matchPurchase.salePrice;
        const taxRate = matchPurchase.tax;
        const qty = local.qty;
        const total = (salePrice * qty) + ((salePrice * qty) * (taxRate / 100));

        // console.log(matchProduct)
        return {
            ...local,
            matchPurchase,
            product: matchProduct ? `${matchProduct.name}-${matchProduct.description}` : "",
            salePrice,
            taxRate,
            qty,
            total
        }
    }) : [];
    const gt = result.length > 0 ? result.reduce((t, c) => t + c.total, 0) : 0;

    return { result, gt };
}


const Add = ({ message }) => {
    const [dt, setDt] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [payment, setPayment] = useState('');
    const [deduct, setDeduct] = useState('');

    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");


    const [customers, setCustomers] = useState([]);


    const [localItems, setLocalItems] = useState([]);
    const [total, setTotal] = useState('');


    const showAddForm = async () => {
        setShow(true);
        try {
            const userId = sessionStorage.getItem('user');
            const responseCustomer = await getDataFromFirebase("customer", userId);
            setCustomers(responseCustomer);
            //-----------------------------------------------------------

            const { result, gt } = await getLocalStorageData();
            //  console.log({ result, gt });
            setLocalItems(result);
            setTotal(gt);
            setPayment('');
            setDeduct('');
            setMsg("");

        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }


    }


    const closeAddForm = () => {
        setShow(false);
    }




    const saveHandler = async (e) => {
        e.preventDefault();
        const userId = sessionStorage.getItem('user');
        const invoice = Math.round(Date.now() / 1000);
        if (payment > (total - deduct)) {
            setMsg("The payment is more than the bill.");
            return;
        }

        try {
            setBusy(true);
            // 8 objects ------
            for (let i = 0; i < localItems.length; i++) {
                const data = [invoice, dt, customerId, i === 0 ? payment : 0, i === 0 ? deduct : 0, userId, localItems[i].purchaseId, localItems[i].qty];
                const arrayObject = saleSchema(data);
                await addDataToFirebase("sale", arrayObject);
                await delay(100);
            }
            message(msg);
        } catch (error) {
            console.error("Error saving sale data:", error);
            message("Error saving sale data.");
        } finally {
            localStorage.removeItem("localItem");
            setBusy(false);
            setShow(false);
        }
    }




    const messageHandler = async (data) => {
        console.log(data);

        const { result, gt } = await getLocalStorageData();
        console.log({ result, gt });
        setLocalItems(result);
        setTotal(gt);
    }



    const removeLocalItemHandeler = async (removeId) => {
        localStorageDeleteItem("localItem", removeId);

        const { result, gt } = await getLocalStorageData();
        console.log({ result, gt });
        setLocalItems(result);
        setTotal(gt);
    }





    return (
        <>
            {busy ? <LoadingDot message="Please wait" /> : null}
            {show && (
                <div className="fixed left-0 top-[60px] right-0 bottom-0 p-4 bg-gray-500/75 z-10 overflow-auto">
                    <div className="w-full lg:w-3/4 mx-auto my-8 bg-white border-2 border-gray-300 rounded-md shadow-md duration-500">



                        <div id="header" className="p-4 flex justify-between items-center border-b border-gray-300 rounded-t-md">
                            <h1 className="text-xl font-bold text-blue-600">Add New Data</h1>
                            <button onClick={closeAddForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>




                        <div id="body" className="w-full p-4 border-0 text-black">
                            <div className="w-full overflow-auto">
                                <h1 className="w-full text-center text-3xl text-blue-600 font-bold">{numberWithCommaISO(total)}</h1>
                                <p className="w-full py-2 text-center text-red-600">{msg}</p>
                                <table className="w-full border border-gray-200">
                                    <thead>
                                        <tr className="w-full bg-gray-200">
                                            <th className="text-start border-b border-gray-200 px-4 py-1">Product</th>
                                            <th className="text-center border-b border-gray-200 px-4 py-1">Quantity</th>
                                            <th className="text-end border-b border-gray-200 px-4 py-1">SalePrice</th>
                                            <th className="text-end border-b border-gray-200 px-4 py-1">Tax</th>
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
                                                    <td className="text-start py-1 px-4">{local.product}</td>
                                                    <td className="text-center py-1 px-4">{numberWithCommaISO(local.qty)}</td>
                                                    <td className="text-end py-1 px-4">{numberWithCommaISO(local.salePrice)}</td>
                                                    <td className="text-end py-1 px-4">{numberWithCommaISO(local.taxRate)}</td>
                                                    <td className="text-end py-1 px-4">{numberWithCommaISO(local.total)}</td>
                                                    <td className="text-center py-2">
                                                        <div className="h-8 flex justify-end items-center space-x-1 mt-1 mr-2">
                                                            <button onClick={() => removeLocalItemHandeler(local.id)} className="w-7 h-7 p-0.5 mr-4 bg-gray-50 hover:bg-gray-300 rounded-md cursor-pointer">
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
                                                <td colSpan={6} className="text-center py-10 px-4">
                                                    Data not available.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {localItems.length > 0 ? (
                                <div className="w-full p-4 overflow-auto">
                                    <div className="w-full h-[1px] my-4 bg-black"></div>
                                    <form className="w-full" onSubmit={saveHandler}>

                                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                                            <div className="col-span-1 lg:col-span-2">
                                                <DropdownEn Title="Customer" Id="customerId" Change={e => setCustomerId(e.target.value)} Value={customerId}>
                                                    {customers.length ? customers.map(customer => <option value={customer.id} key={customer.id}>{customer.name}- {customer.address}</option>) : null}
                                                </DropdownEn>
                                            </div>
                                            <TextDt Title="Date" Id="dt" Change={e => setDt(e.target.value)} Value={dt} />


                                            <TextNum Title="Payment" Id="payment" Change={e => setPayment(e.target.value)} Value={payment} />
                                            <TextNum Title="Deduct" Id="deduct" Change={e => setDeduct(e.target.value)} Value={deduct} />

                                        </div>

                                        <div className="w-full mt-4 flex justify-start pointer-events-auto">
                                            <input type="button" onClick={closeAddForm} value="Close" className="bg-pink-600 hover:bg-pink-800 text-white text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 cursor-pointer" />
                                            <BtnSubmit Title="Save" Class="bg-blue-600 hover:bg-blue-800 text-white" />
                                        </div>
                                    </form>
                                </div>
                            ) : null}
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

