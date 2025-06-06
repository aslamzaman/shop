import React, { useState } from "react";
import { BtnSubmit, TextDt, TextNum, DropdownEn } from "@/components/Form";
import { addDataToFirebase, getDataFromFirebase } from "@/lib/firebaseFunction";
import { purchaseSchema } from "@/lib/Schema";
import LoadingDot from "../LoadingDot";
import { formatedDate } from "@/lib/utils";

const Add = ({ message }) => {
    const [productId, setProductId] = useState('');
    const [vendorId, setVendorId] = useState('');
    const [dt, setDt] = useState('');
    const [qty, setQty] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [tax, setTax] = useState('');
    const [userId, setUserId] = useState('');


    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);

    const [products, setProducts] = useState([]);
    const [vendors, setVendors] = useState([]);



    const showAddForm = async () => {
        setShow(true);
        resetVariables();

        try {
            const userId = sessionStorage.getItem('user');
            const [responseProduct, responseVendor] = await Promise.all([
                getDataFromFirebase("product", userId),
                getDataFromFirebase("vendor", userId)
            ]);

            setVendors(responseVendor);
            setProducts(responseProduct);
        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }
    }


    const closeAddForm = () => {
        setShow(false);
    }


    const resetVariables = () => {
        const userId = sessionStorage.getItem('user');
        setProductId('');
        setVendorId('');
        setDt(formatedDate(new Date()));
        setQty('');
        setPurchasePrice('');
        setSalePrice('');
        setTax('');
        setUserId(userId);
    }



    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            setBusy(true);
            // 8 objects ------
            const arrayObject = [productId, vendorId, dt, qty, purchasePrice, salePrice, tax, userId];
            const data = purchaseSchema(arrayObject);
            const msg = await addDataToFirebase("purchase", data);
            message(msg);
        } catch (error) {
            console.error("Error saving purchase data:", error);
            message("Error saving purchase data.");
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

                                            <DropdownEn Title="Product" Id="productId" Change={e => setProductId(e.target.value)} Value={productId}>
                                                {products.length ? products.map(product => <option value={product.id} key={product.id}>{product.name}- {product.description}</option>) : null}
                                            </DropdownEn>

                                            <DropdownEn Title="Vendor" Id="vendorId" Change={e => setVendorId(e.target.value)} Value={vendorId}>
                                                {vendors.length ? vendors.map(vendor => <option value={vendor.id} key={vendor.id}>{vendor.name}-{vendor.address}</option>) : null}
                                            </DropdownEn>

                                            <TextDt Title="Date" Id="dt" Change={e => setDt(e.target.value)} Value={dt} />
                                            <TextNum Title="Quantity" Id="qty" Change={e => setQty(e.target.value)} Value={qty} />
                                            <TextNum Title="Purchase Price" Id="purchasePrice" Change={e => setPurchasePrice(e.target.value)} Value={purchasePrice} />
                                            <TextNum Title="Sale Price" Id="salePrice" Change={e => setSalePrice(e.target.value)} Value={salePrice} />
                                            <TextNum Title="Tax (%)" Id="tax" Change={e => setTax(e.target.value)} Value={tax} />

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

