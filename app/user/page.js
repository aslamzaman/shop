"use client";
import React, { useState } from "react";
import { BtnSubmit, TextPw } from "@/components/Form";
import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDocs, setDoc, query, where, } from 'firebase/firestore';
import LoadingDot from "@/components/LoadingDot";
import { clear } from "idb-keyval";
import { useRouter } from 'next/navigation';




const User = () => {
    const [password, setPassword] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("Data ready");
    const router = useRouter(null);





    const saveHandler = async (e) => {
        e.preventDefault();
        if (password1 !== password2) {
            setMsg("New password and retype new password not match!");
            return false;
        }

        setBusy(true);
        try {
            const userName = sessionStorage.getItem("userName");
            const userId = sessionStorage.getItem("user");
            //------------------------------------------
            const collectionRef = collection(db, "user");
            const q = query(
                collectionRef,
                where("userName", "==", userName),
                where("password", "==", password)
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            })
            //------------------------------------------
           //  console.log(data);
         
            if (data.length > 0) {
                const obj = data[0];
                const refDoc = doc(collectionRef, obj.id);
                const newObject = {...obj, password: password2};
                await setDoc(refDoc, newObject);
                setMsg("Password changed successfully.");
                setPassword('');
                setPassword1('');
                setPassword2('');
                setBusy(false)
                clear();
                setMsg("");
                router.push("/");
            }
            setMsg("Password not found in database.");
            setBusy(false)
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    }




    return (
        <>
            {busy ? <LoadingDot message="Please wait" /> : null}
            <div className="w-full py-8">
                <h1 className="text-center text-3xl font-bold text-gray-500">Password Change</h1>
                <p className="text-center text-red-500">{msg}</p>

                <div className="px-4 text-black">
                    <form onSubmit={saveHandler} >
                        <div className="grid grid-cols-1 gap-4 my-4">
                            <TextPw Title="Password" Id="password" Change={e => setPassword(e.target.value)} Value={password} Chr={100} />
                            <TextPw Title="New Password" Id="password1" Change={e => setPassword1(e.target.value)} Value={password1} Chr={100} />
                            <TextPw Title="Retype New Password" Id="password2" Change={e => setPassword2(e.target.value)} Value={password2} Chr={100} />
                        </div>
                        <div className="w-full mt-4 flex justify-start pointer-events-auto">
                            <BtnSubmit Title="Save" Class="bg-blue-600 hover:bg-blue-800 text-white" />
                        </div>
                    </form>
                </div>

            </div>
        </>
    );
};

export default User;

