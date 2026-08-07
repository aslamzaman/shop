"use client";
import React, { useState, useEffect } from "react";
import Add from "@/components/invoice/Add";
import Edit from "@/components/invoice/Edit";
import Delete from "@/components/invoice/Delete";
import { getDataFromFirebase, addDataToFirebase } from "@/lib/firebaseFunction";
import { localStorageAddItem, localStorageGetItem } from "@/lib/DatabaseLocalStorage";
import { formatedDate, numberWithComma } from "@/lib/utils";
import { BtnSubmit, TextEn, DropdownEn, TextNum, BtnEn } from "@/components/Form";
import { invoicePDFSchema } from "@/lib/Schema";
import { invoicePDFPrint } from "@/lib/invoicePrint";

const setInvoiceNumber = () => {
    const invoiceNumber = localStorage.getItem("invoiceNumber");
    const invoiceDate = localStorage.getItem("dt");

    if (!invoiceNumber || !invoiceDate) {
        const newInvoice = parseInt(Date.now());
        const newDate = formatedDate(new Date());

        localStorage.setItem("invoiceNumber", newInvoice);
        localStorage.setItem("dt", newDate);

        return [newInvoice, newDate];
    } else {
        return [invoiceNumber, invoiceDate];
    }
}



const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [waitMsg, setWaitMsg] = useState("");
    const [msg, setMsg] = useState("");
    const [newMsg, setNewMsg] = useState("");

    const [invoice, setInvoice] = useState("");
    const [dt, setDt] = useState("");
    const [yr, setYr] = useState("");



    const [customers, setCustomers] = useState([]);
    const [customerId, setCustomerId] = useState('');


    const [payment, setPament] = useState("0");
    const [deduct, setDeduct] = useState("0");
    const [subTotal, setSubTotal] = useState("0");


    const [products, setProducts] = useState([]);
    const [remoteInvoice, setRemoteInvoice] = useState([]);

    useEffect(() => {
        const load = async () => {
            setWaitMsg('Please Wait...');
            try {
                const localYr = sessionStorage.getItem("y");
                setYr(localYr);

                const [customerResponse, productResponse, invoiceResponse] = await Promise.all([
                    getDataFromFirebase("customer"),
                    getDataFromFirebase("product"),
                    getDataFromFirebase("invoice")
                ]);
                setCustomers(customerResponse);
                setProducts(productResponse);
                setRemoteInvoice(invoiceResponse);

                //-----------------------------------


                const data = localStorageGetItem("invoice");
                const dataJoining = data.map(item => {
                    const matchProduct = productResponse.find(p => p.id === `${item.productId}`);
                    console.log(matchProduct)
                    return {
                        ...item,
                        name: matchProduct ? matchProduct.name : " "
                    }
                })
                const subTotalTaka = dataJoining.reduce((t, c) => t + (c.qty * c.price), 0);
                const result = dataJoining.sort((a, b) => parseInt(b.id) > parseInt(a.id) ? 1 : -1);
                setInvoices(result);
                setSubTotal(subTotalTaka)
                setWaitMsg('');
                console.log(result)

                // ---------------------------

                const [invoiceNum, invoiceDt] = setInvoiceNumber();
                setInvoice(invoiceNum)
                setDt(invoiceDt)
            } catch (error) {
                console.log(error);
            }
        };
        load();
    }, [msg]);


    const messageHandler = (data) => {
        setMsg(data);
    }



    const cmdPrint = async () => {
        if (customerId === "" || invoices.length < 1) {
            setNewMsg("Please select a customer or there is not enough data.");
            return false;
        }
        
        const printObject = [
            invoice,
            dt,
            customerId,
            payment,
            deduct,
            yr,
            invoices
        ]
        const data = invoicePDFSchema(printObject);
        console.log("aslam", data)
        invoicePDFPrint(data, customers, products);
    }



    const cmdNew = () => {
        localStorage.removeItem("invoiceNumber");
        localStorage.removeItem("dt");
        localStorage.removeItem("invoice");
        setInvoiceNumber()
        setMsg(Date.now())
    }



    const cmdExport = async (e) => {
        e.preventDefault();
        try {

            if (customerId === "" || invoices.length < 1) {
                setNewMsg("Please select a customer or there is not enough data.");
                return false;
            }

            const exportedData = remoteInvoice.find(item => item.invoiceNo === Number(invoice));
            if(exportedData){
                setNewMsg("This invoice has been exported to the database.");
                return false;
            }
      
            const saveObject = [
                invoice,
                dt,
                customerId,
                payment,
                deduct,
                yr,
                invoices
            ]
            const data = invoicePDFSchema(saveObject);
            console.log("aslam", data)

          const msg = await addDataToFirebase("invoice", data);
            setNewMsg(msg);
          cmdNew();
        } catch (error) {
            console.error("Error saving product data:", error);
            setNewMsg("Error saving product data.");
        }
    }




    return (
        <>
            <div className="w-full mb-3 mt-8">
                <h1 className="w-full text-xl lg:text-3xl font-bold text-center text-blue-700">Invoice</h1>
                <p className="w-full text-center">Invoice Number: <strong>{invoice}</strong><br />Invoice Date: <strong>{dt}</strong></p>
                <p className="w-full text-center text-blue-300">&nbsp;{waitMsg}&nbsp;</p>
            </div>


            <div className="w-full bg-white border-2 border-gray-200 p-4 shadow-md rounded-md">
                <div className="w-full overflow-auto">
                    <p className="w-full text-sm text-center text-pink-600">&nbsp;{msg}&nbsp;</p>
                    <p className="w-full text-sm text-center text-pink-600">&nbsp;{newMsg}&nbsp;</p>
                    <div className="w-full flex justify-start">
                        <div className="w-auto flex items-center space-x-4">
                            <DropdownEn Title="Customer" Id="customerId" Change={e => setCustomerId(e.target.value)} Value={customerId}>
                                {customers.length ? customers.map(customer => <option value={customer.id} key={customer.id}>{customer.name}-{customer.address}</option>) : null}
                            </DropdownEn>
                            <TextNum Title="Payment" Id="payment" Change={e => setPament(e.target.value)} Value={payment} />
                            <TextNum Title="Deduct" Id="deduct" Change={e => setDeduct(e.target.value)} Value={deduct} />
                            <BtnEn Title="Print" Click={cmdPrint} Class="bg-blue-600 hover:bg-blue-800 text-white" />
                            <BtnEn Title="Export" Click={cmdExport} Class="bg-blue-600 hover:bg-blue-800 text-white" />
                            <BtnEn Title="NewInvoice" Click={cmdNew} Class="bg-blue-600 hover:bg-blue-800 text-white" />

                        </div>
                    </div>
                    <table className="w-full border border-gray-200">
                        <thead>
                            <tr className="w-full bg-gray-200">
                                <th className="text-start border-b border-gray-200 px-4 py-2">Product</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Thn</th>
                                <th className="text-center border-b border-gray-200 px-4 py-2">Qty</th>
                                <th className="text-end border-b border-gray-200 px-4 py-2">Price</th>
                                <th className="text-end border-b border-gray-200 px-4 py-2">Total</th>
                                <th className="w-[100px] font-normal">
                                    <div className="w-full flex justify-end items-center pr-2.5 font-normal">
                                        <Add message={messageHandler} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                invoices.length ? invoices.map(invoice => {
                                    return (
                                        <tr className="border-b border-gray-200 hover:bg-gray-100" key={invoice.id}>
                                            <td className="text-start py-2 px-4">{invoice.name}</td>
                                            <td className="text-center py-2 px-4">{invoice.thn}</td>
                                            <td className="text-center py-2 px-4">{invoice.qty}</td>
                                            <td className="text-end py-2 px-4">{invoice.price}</td>
                                            <td className="text-end py-2 px-4">{numberWithComma((invoice.qty * invoice.price))}</td>
                                            <td className="flex justify-end items-center mt-1">
                                                <Edit message={messageHandler} id={invoice.id} data={invoice} />
                                                <Delete message={messageHandler} id={invoice.id} data={invoice} />
                                            </td>
                                        </tr>
                                    )
                                })
                                    : null
                            }

                            <tr className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="text-start py-2 px-4"><strong>Total</strong></td>
                                <td className="text-center py-2 px-4"></td>
                                <td className="text-center py-2 px-4"></td>
                                <td className="text-center py-2 px-4"></td>
                                <td className="text-end py-2 px-4"><strong>{numberWithComma(subTotal)}</strong></td>
                                <td className="flex justify-end items-center mt-1">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Invoice;

