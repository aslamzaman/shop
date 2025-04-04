import React, { useState } from "react";
import { BtnSubmit, TextDt, TextNum, DropdownEn } from "@/components/Form";
import { localStorageAddItem } from "@/lib/utils";
import { stockBalance } from "@/helpers/stockbalanceHelpers";





const AddItem = ({ message }) => {
    const [purchaseId, setPurchaseId] = useState('');
    const [qty, setQty] = useState('');
    const [msg, setMsg] = useState('');



    const [show, setShow] = useState(false);
    const [total, setTotal] = useState('0');
    const [purchases, setPurchases] = useState([]);




    const showAddItemForm = async () => {
        setShow(true);
        resetVariables();
        try {
            const data = await stockBalance("1970-01-01", "2070-12-31");
            console.log(data)
            setPurchases(data.result);
        } catch (error) {
            console.log(error);
        }
    }


    const closeAddItemForm = () => {
        setShow(false);
    }


    const resetVariables = () => {
        setPurchaseId('');
        setQty('0');
    }



    const createObject = () => {
        return {
            id: Date.now(),
            purchaseId: purchaseId,
            qty: qty
        }
    }

    const check = () => {
        const product = purchases.find(purchase => purchase.id === purchaseId);
        const stockProduct = parseFloat(product.stock);
        const saleQty = parseFloat(qty);
        const balance = stockProduct - saleQty;
        if (balance < 0) {
            return false
        } else {
            return true;
        }
    }

    const saveHandler = (e) => {
        e.preventDefault();
        const isBalance = check();
       if(!isBalance){
        setMsg("Balance not available!");
        return false;
       }

        try {
            const newObject = createObject();
            const msg = localStorageAddItem("localItem", newObject);
            message(msg);
            setMsg("");
        } catch (error) {
            console.error("Error saving sale data:", error);
        } finally {
            setShow(false);
        }
    }



    return (
        <>
            {show && (
                <div className="fixed left-0 top-[60px] right-0 bottom-0 p-4 bg-black bg-opacity-30 backdrop-blur-sm z-50 overflow-auto">
                    <div className="w-full lg:w-1/2  mx-auto my-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-500">
                        <div className="px-4 md:px-6 py-4 flex justify-between items-center border-b border-gray-300 rounded-t-md">
                            <h1 className="text-xl font-bold text-blue-600">Add New Product</h1>
                            <button onClick={closeAddItemForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 pb-6 border-0 text-black bg-white">
                            <div className="w-full overflow-auto">
                                <p className="w-full text-start text-red-600">{msg}</p>
                                <div className="p-4">
                                    <form onSubmit={saveHandler}>
                                        <div className="grid grid-cols-1 gap-2">
                                            <DropdownEn Title="Product" Id="purchaseId" Change={e => setPurchaseId(e.target.value)} Value={purchaseId}>
                                                {purchases.length ? purchases.map(purchase => <option value={purchase.id} key={purchase.id}>{purchase.product} - ({purchase.stock}@{purchase.salePrice}) - {purchase.vendor}</option>) : null}
                                            </DropdownEn>
                                            <TextNum Title="Quantity" Id="qty" Change={e => setQty(e.target.value)} Value={qty} />
                                        </div>
                                        <div className="w-full mt-4 flex justify-start pointer-events-auto">
                                            <input type="button" onClick={closeAddItemForm} value="Close" className="bg-pink-600 hover:bg-pink-800 text-white text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 cursor-pointer" />
                                            <BtnSubmit Title="Save" Class="bg-blue-600 hover:bg-blue-800 text-white" />
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={showAddItemForm} className="px-1 py-1 bg-blue-500 hover:bg-blue-700 rounded-md transition duration-500" title="Add New">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-7 h-7 stroke-white hover:stroke-gray-100">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </>
    )
}
export default AddItem;

