"use client";
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import logo from "@/public/images/logo/shop.png";



const MenuData = [
    {
        title: 'Settings',
        group: [
            {
                label: 'Customers',
                url: '/customer'
            },
            {
                label: 'Vendors',
                url: '/vendor'
            },

            {
                label: 'Products',
                url: '/product'
            },
        ]
    },
    {
        title: 'Purchase & Sale',
        group: [
            {
                label: 'Purchases',
                url: '/purchase'
            },
            {
                label: 'Sales',
                url: '/sale'
            },
            {
                label: 'Stock/Balance',
                url: '/stockbalance'
            }
        ]
    },
    {
        title: 'Invoices',
        group: [
            {
                label: 'New Invoice',
                url: '/invoice'
            },
            {
                label: 'Invoice List',
                url: '/invoice_list'
            }
        ]
    },
    {
        title: 'Payments & Dues',
        group: [
            {
                label: 'Payments',
                url: '/payments'
            },
            {
                label: 'Customer Dues',
                url: '/customerdues'
            }
        ]
    }


]



const Home = ({ children }) => {
    const [menuPos, setMenuPos] = useState("left-[-100vw]");
    const [userName, setUserName] = useState("");
    const [yr, setYr] = useState("");
    const router = useRouter(null);
    const posFull = "left-0 right-0";
    const posLeft = "left-[-100vw]";



    useEffect(() => {
        const sessionDataUser = sessionStorage.getItem('u');
        setUserName(sessionDataUser);
        if (!sessionDataUser) {
            router.push("/");
        }
        window.addEventListener("resize", () => setMenuPos(posLeft));
        return () => {
            window.removeEventListener("resize", () => setMenuPos(posLeft));
        };

    }, [router])




    const menuCloseHander = () => {
        if (menuPos === posFull) {
            setMenuPos(posLeft);
        } else {
            setMenuPos(posFull);
        }
    }



    const menuHideHandler = (e) => {
        if (e.target.id === 'leftMenu') {
            setMenuPos(posLeft);
        }
    }



    const logOutHandler = () => {
        sessionStorage.clear();
        router.push('/');
    }



    return (
        <>
            <div id="header" className="fixed h-[60px] left-0 top-0 right-0 px-4 lg:p-6 flex items-center justify-between bg-white border-b-2 border-gray-300 drop-shadow-lg z-50">
                <div className='flex items-center justify-center space-x-3 lg:space-x-0'>
                    <div className='block lg:hidden'>
                        <MenuBar click={menuCloseHander} />
                    </div>
                    <Link href="/dashboard" className='flex items-center justify-start space-x-2'>
                        <Image src={logo} alt='Logo' width={164} height={106} className='w-12 lg:w-16 h-auto' />
                        <h1 className='text-start text-base lg:text-xl text-blue-600 font-bold uppercase scale-y-150'>Shopdatabase</h1>
                    </Link>
                </div>

                <div>
                    <p className='uppercase leading-4 mt-1'>{userName}</p>
                </div>

            </div>



            <div id="leftMenu" onClick={menuHideHandler} className={`fixed ${menuPos} top-[60px] bottom-0 transition-all duration-500 z-40`}>
                <div className='w-[250px] h-[calc(100vh-60px)] pb-[100px] flex flex-col text-sm md:text-base bg-gray-100 border-r-2 border-gray-200 drop-shadow-xl overflow-auto'>
                    <LeftMenu />
                    <button onClick={logOutHandler} className='w-full text-start pl-8 hover:bg-gray-300 transition-all duration-500 cursor-pointer'>Logout</button>
                </div>
            </div>



            <div id="container" className='fixed left-0 top-[60px] right-0 bottom-0 flex'>
                <div id="leftBar" className="hidden lg:block w-[300px] h-[calc(100vh-60px)] pb-[100px] flex flex-col bg-gray-100 border-r-2 border-gray-200 drop-shadow-xl overflow-auto">
                    <LeftMenu />
                    <button onClick={logOutHandler} className='w-full text-start pl-8 hover:bg-gray-300 transition-all duration-500 cursor-pointer'>Logout</button>
                </div>



                <div className='w-full h-[calc(100vh-60px)] px-4 pt-4 pb-[200px] bg-white overflow-auto  bg-repeat bg-size-[10px]' style={{ backgroundImage: "url('/images/logo/shop.jpg')" }}>
                    {children}
                </div>
            </div>
        </>
    )

}

export default Home





const LeftMenu = () => {
    return (
        <>
            {MenuData ? MenuData.map((data, i) => {
                const menuTitle = data.title;
                const menus = data.group;
                return (
                    <div className='flex flex-col' key={i}>
                        <label className='pl-4 pt-4 pb-0.5 text-xl text-gray-400 font-semibold border-b-2 border-gray-200'>{menuTitle}</label>
                        {menus ? menus.map((item, index) => <Link href={item.url} className='pl-8 hover:bg-gray-300 transition-all duration-500' key={index}>{item.label}</Link>) : null}
                    </div>
                )
            }) : null}
            <div className='w-full h-[2px] my-4 bg-gray-200'></div>
        </>
    )

}




const MenuBar = ({ click }) => {
    return <button onClick={click} className='w-7 h-7 flex item-center cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" fill='none' viewBox='0 0 30 30'>
        <path d="M2 8 L28 8 M2 15 L28 15 M2 22 L28 22"
            className="fill-none stroke-gray-500" style={{ strokeWidth: '4px' }} />
    </svg></button>
}
