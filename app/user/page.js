"use client";
import React, { useState } from "react";
import { BtnSubmit, TextPw } from "@/components/Form";
import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDocs, setDoc, query, where, } from 'firebase/firestore';
import LoadingDot from "@/components/LoadingDot";
import { clear } from "idb-keyval";


const User = () => {
    const [password, setPassword] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("Data ready");


    const saveHandler = async (e) => {
        e.preventDefault();
        if (password1 !== password2) {
            setMsg("Password and retype password not match!");
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
            // console.log(data);
            if (data.length > 0) {
                const refDoc = doc(collectionRef, userId);
                const obj = data[0];
                const newObject = { ...obj, password: password2 };
                await setDoc(refDoc, newObject);
                setMsg("Password changed successfully.");
                setPassword('');
                setPassword1('');
                setPassword2('');
                setBusy(false)
                return false;
            }
            setMsg("Password not found in database.");
            setBusy(false)
        } catch (error) {
            console.error("Error saving user data:", error);
        }
    }



    const refreshHandler = () => {
        clear();
    }



    return (
        <>
            {busy ? <LoadingDot message="Please wait" /> : null}
            <div className="flex justify-end mr-4">
                <button title="Refresh Database" onClick={refreshHandler}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 stroke-black">

                        <path strokeLinecap="round" strokeLinejoin="round" d="m 12.9075,21.335633 c 1.998188,-0.182301 4.064733,-1.111009 5.525082,-2.482978 0.38496,-0.361664 0.457676,-0.798745 0.179212,-1.077208 -0.269404,-0.269406 -0.566704,-0.197257 -1.091806,0.264957 -1.726301,1.519552 -3.799724,2.240533 -6.031822,2.097419 C 10.249809,20.058422 9.4518996,19.847526 8.3699944,19.31365 6.3037363,18.294039 4.6731394,16.321737 4.0908801,14.137815 3.913313,13.471801 3.7504647,11.41531 3.8752909,11.41531 c 0.039245,0 0.3945891,0.33631 0.7896552,0.747355 0.5971702,0.621322 0.776177,0.747353 1.0614916,0.747353 0.2453785,0 0.3915139,-0.07375 0.5127467,-0.258776 0.1511278,-0.23065 0.1523663,-0.291573 0.011394,-0.560516 -0.2760291,-0.526593 -2.7812065,-2.9174772 -3.056946,-2.9174772 -0.1729632,0 -0.6700423,0.4209748 -1.6720251,1.4160322 -1.20614382,1.197808 -1.4258883,1.466001 -1.4258883,1.740267 0,0.409053 0.16954145,0.58047 0.57411921,0.58047 0.25323569,0 0.48073029,-0.162846 1.11862019,-0.800736 0.440405,-0.440405 0.8162348,-0.800736 0.8351767,-0.800736 0.018943,0 0.034779,0.444408 0.035188,0.987575 9.449e-4,1.313853 0.3028259,2.537337 0.9547757,3.870226 1.7071799,3.49027 5.3695996,5.527317 9.2939012,5.169286 z m 9.583628,-7.279324 c 1.082419,-1.084647 1.413153,-1.480572 1.413153,-1.69169 0,-0.310947 -0.294277,-0.629013 -0.581968,-0.629013 -0.105316,0 -0.591153,0.390114 -1.079648,0.866921 l -0.888171,0.866923 0.0021,-1.320673 C 21.361008,9.4700072 20.562162,7.3754607 18.847878,5.5707659 17.581103,4.2371733 16.301792,3.4469177 14.540636,2.9100942 13.700601,2.6540411 13.432427,2.6238241 11.999997,2.6238241 c -1.432433,0 -1.700607,0.030217 -2.5406398,0.2862701 C 7.9291761,3.3765134 6.4672471,4.2057607 5.6123936,5.0921996 5.1299956,5.5924218 5.0998456,6.0392262 5.5339607,6.2545229 5.8506103,6.4115626 6.0351138,6.3279863 6.7279354,5.7136775 8.3205997,4.3015038 10.806084,3.5472819 12.915402,3.8360877 c 2.024059,0.2771324 3.37724,0.9380033 4.807178,2.347745 1.53797,1.5162491 2.309161,3.2244764 2.416673,5.3530523 0.03155,0.624713 0.02443,1.267115 -0.01584,1.427561 l -0.07322,0.291717 -0.78408,-0.760278 c -0.431244,-0.418154 -0.876107,-0.760279 -0.988583,-0.760279 -0.273704,0 -0.527622,0.211743 -0.618019,0.515371 -0.06396,0.214826 0.125398,0.449666 1.398929,1.734928 1.12971,1.140117 1.536587,1.486471 1.746222,1.486471 0.20848,0 0.608555,-0.335928 1.686469,-1.416067 z" />
                    </svg>

                </button>
            </div>
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

