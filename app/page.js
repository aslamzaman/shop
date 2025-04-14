"use client";
import React, { useEffect, useState } from "react";
import { BtnSubmit, TextEn, TextPw } from "@/components/Form";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from 'firebase/firestore';
import Image from "next/image";
import logo from "@/public/images/logo/shop.png";
import { addDataToFirebase } from "@/lib/firebaseFunction";
import { iplocationSchema } from "@/lib/Schema";


export default function Home() {
  const [user, setUser] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("For evaluation:- User Name: user; Password: password");

  const router = useRouter();


  const [address, setAddress] = useState('');


  useEffect(() => {
    const getIp = async () => {

      const res = await fetch("https://api.ipify.org?format=json");
      const json = await res.json();
      const ip = json.ip;

      const data = await fetch(`https://ipapi.co/${ip}/json/`);
      const loc = await data.json();
      const str = `${ip};${loc.country_name};${loc.city};${loc.latitude},${loc.longitude}`
      setAddress(str);
      console.log({ str, loc });

    }
    getIp();
  }, [])



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
        sessionStorage.setItem('period', findUser.period);

        /* add location */
        const ipData = iplocationSchema([address]);
        await addDataToFirebase("iplocation", ipData);

        router.push('/dashboard');
      } else {
        setMsg('User name or password not match!')
      }
    } catch (error) {
      console.log(error);
    }

  };





  return (
    <div className="w-scree h-screen inset-0 px-4 py-8 flex flex-col items-center justify-center">
      <div className="p-4">
        <Image src={logo} alt="logo" width={1875} height={870} priority={true} className="w-24 lg:w-48 h-auto mx-auto" />

        <h1 className="w-full text-md lg:text-2xl font-bold text-center text-blue-700 leading-6">SHOPDATABASE<br /> <span className="text-lg text-red-800 animate-pulse">Super-easy storage system</span></h1>
      </div>



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
            </div>
            <BtnSubmit Title="Login" Class="bg-blue-600 hover:bg-blue-800 text-white" />
          </form>
        </div>
      </div>
    </div>
  );
}