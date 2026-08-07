import React, { useState } from "react";
import { BtnSubmit, TextEn } from "@/components/Form";
import { localStorageUpdateItem } from "@/lib/DatabaseLocalStorage";

const Edit = ({ message, id, data  }) => {
    const [productId, setProductId] = useState('');
    const [thn, setThn] = useState('');
    const [qty, setQty] = useState('');
    const [price, setPrice] = useState('');   
    const [show, setShow] = useState(false);


  const showEditForm = () => {
        message("Ready to edit");
        setShow(true);
        try {
            const { productId, thn, qty, price } = data;
            setProductId(productId);
            setThn(thn);
            setQty(qty);
            setPrice(price);
        } catch (err) {
            console.log(err);
        }
    };


    const closeEditForm = () => {
        setShow(false);
    };


    const createObject = () => {
        return {
            id: id,
            productId: productId,
            thn: thn,
            qty: qty,
            price: price            
        }
    }


    const updateHandler =  (e) => {
        e.preventDefault();
        try {
            const newObject = createObject();
            const msg =  localStorageUpdateItem('invoice', id, newObject);
            message(msg);
        } catch (error) {
            console.error("Error updating invoice data:", error);
            message("Error updating invoice data.");
        } finally {
            setShow(false);
        }
    }


    return (
        <>
            {show && (
                <div className="fixed inset-0 px-2 py-16 bg-gray-500/50 z-10 overflow-auto">
                    <div className="w-full md:w-[500px] lg:w-[800px] mx-auto mb-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-300">
                        <div className="px-6 md:px-6 py-2 flex justify-between items-center border-b border-gray-300">
                            <h1 className="text-xl font-bold text-blue-600">Edit Existing Data</h1>
                            <button onClick={closeEditForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>

                        <div className="px-4 pb-6 text-black">
                            <form onSubmit={updateHandler} >
                                <div className="grid grid-cols-1 gap-4 my-4">
                                    <TextEn Title="ProductId" Id="productId" Change={e => setProductId(e.target.value)} Value={productId} Chr={150} />
                                    <TextEn Title="Thn" Id="thn" Change={e => setThn(e.target.value)} Value={thn} Chr={150} />
                                    <TextEn Title="Qty" Id="qty" Change={e => setQty(e.target.value)} Value={qty} Chr={150} />
                                    <TextEn Title="Price" Id="price" Change={e => setPrice(e.target.value)} Value={price} Chr={150} />                                
                                </div>
                                <div className="w-full flex justify-start">
                                    <input type="button" onClick={closeEditForm} value="Close" className="bg-pink-600 hover:bg-pink-800 text-white text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 cursor-pointer" />
                                    <BtnSubmit Title="Save" Class="bg-blue-600 hover:bg-blue-800 text-white" />
                                </div>
                            </form>
                        </div>


                    </div >
                </div >
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
  
