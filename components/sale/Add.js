import React, { useState } from "react";
import { BtnSubmit, TextDt, TextNum, DropdownEn } from "@/components/Form";
import { addDataToFirebase, getDataFromFirebase } from "@/lib/firebaseFunction";
import LoadingDot from "../LoadingDot";
import { formatedDate } from "@/lib/utils";

const Add = ({ message, id, data }) => {
    const [dt, setDt] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [unit, setUnit] = useState('');
    const [deduct, setDeduct] = useState('');
    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);

    const [total, setTotal] = useState('0');


    const [customers, setCustomers] = useState([]);




    const showAddForm = async () => {
        setShow(true);
        resetVariables();
        console.log(data)
        try {
            const customerResponse = await getDataFromFirebase('customer');
            setCustomers(customerResponse);
        } catch (error) {
            console.log(error);
        }
    }


    const closeAddForm = () => {
        setShow(false);
    }


    const resetVariables = () => {
        setDt(formatedDate(new Date()));
        setUnit('0');
        setDeduct('0');
    }


    const createObject = () => {
        const userId = sessionStorage.getItem('user');
        return {
            dt: dt,
            customerId: customerId,
            purchaseId: id,
            unit: unit,
            deduct: deduct,
            userId: userId,
            createdAt: new Date().toISOString()
        }
    }


    const saveHandler = async (e) => {
        e.preventDefault();
        const qty = parseFloat(data.stock);
        const salQty = parseFloat(unit);
        if (salQty > qty) {
            setTotal(`The 'Unit' must be within ${qty}`);
            return false;
        }
        try {
            setBusy(true);
            const newObject = createObject();
            const msg = await addDataToFirebase("sale", newObject);
            message(msg);
        } catch (error) {
            console.error("Error saving sale data:", error);
            message("Error saving sale data.");
        } finally {
            setBusy(false);
            setShow(false);
        }
    }

    //--------------------------------------

    const unitChangeHandler = (e) => {
        const event = e.target.value;
        setUnit(event);
        if (isNaN(event)) return;
        const gt = parseFloat(event) * 500 - parseFloat(deduct);
        setTotal(gt);
    }


    const deductChangeHandler = (e) => {
        const event = e.target.value;
        setDeduct(event);
        if (isNaN(event)) return;
        const gt = parseFloat(unit) * 500 - parseFloat(event);
        setTotal(gt);
    }



    return (
        <>
            {busy ? <LoadingDot message="Please wait" /> : null}
            {show && (
                <div className="fixed left-0 top-[60px] right-0 bottom-0 p-4 bg-black bg-opacity-30 backdrop-blur-sm z-10 overflow-auto">
                    <div className="w-full sm:w-11/12 md:w-9/12 lg:w-7/12 xl:w-1/2 mx-auto my-10 bg-white border-2 border-gray-300 rounded-md shadow-md duration-500">
                        <div className="px-4 md:px-6 py-4 flex justify-between items-center border-b border-gray-300 rounded-t-md">
                            <h1 className="text-xl font-bold text-blue-600">Add New Data</h1>
                            <button onClick={closeAddForm} className="w-8 h-8 p-0.5 bg-gray-50 hover:bg-gray-300 rounded-md transition duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full stroke-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 pb-6 border-0 text-black">
                            <div className="w-full overflow-auto">
                                <div className="p-4">
                                    <h1 className="w-full text-center text-3xl text-blue-600">{total}</h1>
                                    <form onSubmit={saveHandler}>
                                        <div className="grid grid-cols-1 gap-4">
                                            <TextDt Title="Date" Id="dt" Change={e => setDt(e.target.value)} Value={dt} />

                                            <DropdownEn Title="Customer" Id="customerId" Change={e => setCustomerId(e.target.value)} Value={customerId}>
                                                {customers.length ? customers.map(customer => <option value={customer.id} key={customer.id}>{customer.name} - {customer.address}</option>) : null}
                                            </DropdownEn>


                                            <TextNum Title="Unit" Id="unit" Change={unitChangeHandler} Value={unit} />
                                            <TextNum Title="Deduct" Id="deduct" Change={deductChangeHandler} Value={deduct} />
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
            <button onClick={showAddForm} title="Edit" className="px-1 py-1 hover:bg-teal-300 rounded-md transition duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#FF0000" viewBox="0 0 24 10" className="w-20 h-9 transition duration-500">
                    <path d="M 1.326172,1.783203 V 8.216797 H 18.402344 L 20.539062,6.609375 22.673828,5.001953 20.539062,3.390625 18.402344,1.783203 Z m 2.5449219,0.6464845 c 0.2615494,0 0.5106141,0.029127 0.7441406,0.089844 0.2381968,0.060717 0.4853085,0.1476729 0.7421875,0.2597657 L 5.013672,3.605469 C 4.7848161,3.512058 4.5786351,3.440048 4.3964845,3.388672 4.2143339,3.337299 4.0274292,3.3125 3.8359376,3.3125 3.6351049,3.3125 3.4824222,3.35776 3.3750001,3.451172 3.267578,3.544582 3.2128907,3.66695 3.2128907,3.816406 c 0,0.177481 0.079483,0.317171 0.2382813,0.419922 0.1587978,0.102751 0.3941059,0.229449 0.7070311,0.378906 0.2568791,0.121434 0.4748638,0.246179 0.6523439,0.376954 0.1821505,0.130774 0.3218408,0.28541 0.4199218,0.46289 0.098081,0.17748 0.1484375,0.396653 0.1484375,0.658203 0,0.4437 -0.1621085,0.800186 -0.484375,1.066407 -0.3175958,0.261549 -0.7708885,0.390624 -1.359375,0.390624 -0.5277695,0 -0.9983856,-0.09995 -1.4140624,-0.300781 V 6.28125 c 0.2381968,0.102751 0.4821665,0.198369 0.734375,0.287109 0.2568789,0.08407 0.5114634,0.126954 0.7636718,0.126953 0.2615496,0 0.4472654,-0.0484 0.5546874,-0.146484 C 4.2859208,6.446076 4.341797,6.316237 4.341797,6.162109 4.341797,6.036005 4.297725,5.928584 4.2089845,5.839844 4.1249145,5.751104 4.0100208,5.670432 3.8652345,5.595703 3.7204481,5.516304 3.5540087,5.43249 3.3671876,5.34375 3.2504244,5.287703 3.1237266,5.221212 2.9882813,5.146484 2.8528361,5.067085 2.7237606,4.971468 2.5976563,4.859375 2.4762227,4.742612 2.3743209,4.602921 2.294922,4.439453 2.215523,4.275984 2.1757813,4.080418 2.1757813,3.851562 c 0,-0.448369 0.1514939,-0.797383 0.4550782,-1.0449215 0.3035842,-0.2522083 0.7171354,-0.376953 1.2402344,-0.376953 z m 3.5449217,0.048828 H 8.7343751 L 10.505859,7.501953 H 9.3496095 L 8.9648439,6.324219 H 7.1992188 L 6.8144531,7.501953 h -1.15625 z m 3.6855464,0.019531 h 1.072266 V 6.619141 h 2.025391 v 0.882812 h -3.097657 z m 3.951172,0 h 2.878907 V 3.367188 h -1.820313 v 1.099609 h 1.695313 V 5.335938 H 16.111328 V 6.625 h 1.820313 V 7.501953 H 15.052734 Z M 8.076172,3.234375 C 8.05749,3.341797 8.029552,3.465353 7.992188,3.605469 l -0.09961,0.40625 C 7.859884,4.142493 7.831946,4.253057 7.808594,4.341797 L 7.451172,5.427734 H 8.7207032 L 8.3691407,4.341797 C 8.3504587,4.271739 8.3213316,4.165507 8.279297,4.025391 8.241933,3.885275 8.2033802,3.744395 8.1660157,3.599609 Z" />
                </svg>
            </button>
        </>
    )
}
export default Add;

