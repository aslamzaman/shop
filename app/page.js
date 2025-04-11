"use client";
import React, { useEffect, useState } from "react";
import { BtnSubmit, TextEn, TextPw } from "@/components/Form";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from 'firebase/firestore';




export default function Home() {
  const [user, setUser] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");

  const router = useRouter();




  const submitHandler = async (e) => {
    e.preventDefault();
    setMsg("Please wait...");
    try {
      const collectionRef = collection(db, 'user');
      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })

      const findUser = data.find(item => item.userName === user && item.password === pw);
      if (findUser) {
        sessionStorage.setItem('user', findUser.id);
        sessionStorage.setItem('userName', findUser.userName);
        router.push('/dashboard');
      } else {
        setMsg('User name or password not match!')
      }
    } catch (error) {
      console.log(error);
    }

  };





  return (
    <div className="w-scree h-screen p-4 flex items-center justify-center">
      <div className="w-full lg:w-1/2 border-2 border-gray-300 rounded-lg shadow-lg">
        <div className="w-full border-b-2  border-gray-300">
          <h1 className="py-3 text-center text-2xl font-bold">Log In</h1>
        </div>
        <div className="px-4 py-6">
          <p className="py-2 text-center text-red-500">{msg}</p>
          <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 gap-4">
              <TextEn Title="User Name" Id="user" Change={e => setUser(e.target.value)} Value={user} Chr={50} />
              <TextPw Title="Password" Id="pw" Change={e => setPw(e.target.value)} Value={pw} Chr={50} />
            </div>
            <BtnSubmit Title="Login" Class="bg-blue-600 hover:bg-blue-800 text-white" />
          </form>
        </div>
      </div>
    </div>
  );
}