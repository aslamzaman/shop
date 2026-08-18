import React, { useState } from "react";
import { BtnSubmit, DropdownEn, TextDt, TextNum, TextEnDisabled } from "@/components/Form";
import { addDataToFirebase, getDataFromFirebase } from "@/lib/firebaseFunction";
import { saleSchema } from "@/lib/Schema";
import LoadingDot from "../LoadingDot";
import { formatedDate } from "@/lib/utils";


const Add = ({ message }) => {
    const [dt, setDt] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [productId, setProductId] = useState('');
    const [shadeNo, setShadeNo] = useState('');
    const [qty, setQty] = useState('');
    const [price, setPrice] = useState('');
    const [yr, setYr] = useState('');



    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);

    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);



    const showAddForm = async () => {
        setShow(true);
        resetVariables();
        try {
             const [responseProduct, responseCustomer] = await Promise.all([
                 getDataFromFirebase("product"),
                 getDataFromFirebase("customer")
             ]);
 
             setProducts(responseProduct);
             setCustomers(responseCustomer);
        } catch (error) {
            console.error('Failed to fetch delivery data:', error);
        }
    }


    const closeAddForm = () => {
        setShow(false);
    }


    const resetVariables = () => {
        const year = sessionStorage.getItem('y');
        setDt(formatedDate(new Date()));  
        setCustomerId('');
        setProductId('');
        setShadeNo('');
        setQty('');
        setPrice('');
        setYr(year);
    }


     

    const saveHandler = async (e) => {
        e.preventDefault();
        try {
            setBusy(true);
            // 7 objects ------
            const arrayObject = [dt, customerId,  productId, shadeNo, qty, price, yr];
            const data = saleSchema(arrayObject);
            const msg = await addDataToFirebase("sale", data);
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

                                            <TextDt Title="Date" Id="dt" Change={e => setDt(e.target.value)} Value={dt} />

                                            <DropdownEn Title="Customer" Id="customerId" Change={e => setCustomerId(e.target.value)} Value={customerId}>
                                                {customers.length ? customers.map(customer => <option value={customer.id} key={customer.id}>{customer.name}-{customer.address}</option>) : null}
                                            </DropdownEn>
                                            <DropdownEn Title="Product" Id="productId" Change={e => setProductId(e.target.value)} Value={productId}>
                                                {products.length ? products.map(product => <option value={product.id} key={product.id}>{product.name}- {product.description}</option>) : null}
                                            </DropdownEn>

                                            <TextNum Title="Thaan" Id="shadeNo" Change={e => setShadeNo(e.target.value)} Value={shadeNo} />

                                            <TextNum Title="Quantity(Meter)" Id="qty" Change={e => setQty(e.target.value)} Value={qty} />
                                            <TextNum Title="Price" Id="price" Change={e => setPrice(e.target.value)} Value={price} />

                                            <TextEnDisabled Title="Year" Id="yr" Change={e => setYr(e.target.value)} Value={yr} />

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

