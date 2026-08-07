"use client";
import React, { useEffect, useState } from "react";
import { BtnSubmit, TextEn, TextPw, DropdownEn } from "@/components/Form";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from 'firebase/firestore';
const yearsList = [2025,2026,2027,2028,2029,2030,2031]




export default function Home() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");
  const [pw, setPw] = useState("");
  const [yr, setYr] = useState("");
  const [msg, setMsg] = useState("Enter your user and password");

  const router = useRouter();

  useEffect(() => {
      const getData = async () => {
          try {
            const collectionRef = collection(db, "user");
            const querySnapshot = await getDocs(collectionRef);
            const data = querySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            })
            setUsers(data);
            console.log(data)
          } catch (error) {
              console.error("Error fetching data:", error);
              return [];
          }
      };
      getData();
  }, []);


  const submitHandler = async (e) => {
    e.preventDefault();
    setMsg("Please wait...");
    try {
      const check = users.find(u => u.userId === user && u.password === pw);

      if(check){
        sessionStorage.setItem('u', user);
        sessionStorage.setItem('y', yr);
        router.push('/dashboard');
      }else{
        setMsg('User name or password not match!')
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-scree h-screen inset-0 px-4 py-8 flex flex-col items-center justify-center">
      <div className="w-full lg:w-1/2 border-2 border-gray-300 rounded-lg shadow-lg">
        <div className="w-full border-b-2  border-gray-300">
          <h1 className="py-2 text-center text-2xl font-bold">Log In</h1>
        </div>
        <div className="px-4 py-2">
          <p className="py-2 text-sm text-center text-red-500">{msg}</p>
          <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 gap-2">
              <TextEn Title="User Name" Id="user" Change={e => setUser(e.target.value)} Value={user} Chr={50} />
              <TextPw Title="Password" Id="pw" Change={e => setPw(e.target.value)} Value={pw} Chr={50} />
              <DropdownEn children={yearsList.map(item =>(<option value={item} key={item}>{item}</option>))} Title="Select Year" Id="yr" Change={e => setYr(e.target.value)} Value={yr} />
            </div>
            <BtnSubmit Title="Login" Class="bg-blue-600 hover:bg-blue-800 text-white" />
          </form>
        </div>
      </div>
    </div>
  );
}
