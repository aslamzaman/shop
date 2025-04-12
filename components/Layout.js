"use client";
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import logo from "@/public/images/logo/logo.png";



const MenuData = [
    {
        title: 'Settings',
        group: [
            {
                label: 'Customer',
                url: '/customer'
            },
            {
                label: 'Vendor',
                url: '/vendor'
            },

            {
                label: 'Product',
                url: '/product'
            },
        ]
    },
    {
        title: 'Purchase & Sale',
        group: [
            {
                label: 'Purchase',
                url: '/purchase'
            },
            {
                label: 'Sale',
                url: '/sale'
            }
        ]
    },
    {
        title: 'Reports',
        group: [
            {
                label: 'Stock/Balance',
                url: '/stockbalance'
            },
        ]
    },
    {
        title: 'Bills & Receipt',
        group: [
            {
                label: 'Invoice',
                url: '/invoice'
            },
            {
                label: 'Money Receipt',
                url: '/moneyreceipt'
            }
        ]
    },
    {
        title: 'Dues',
        group: [
            {
                label: 'Customer Dues',
                url: '/purchase'
            },
        ]
    },

]



const Home = ({ children }) => {
    const [menuPos, setMenuPos] = useState("left-[-100vw]");
    const [userName, setUserName] = useState("");
    const router = useRouter(null);
    const posFull = "left-0 right-0";
    const posLeft = "left-[-100vw]";



    useEffect(() => {
        const sessionData = sessionStorage.getItem('user');
        const name = sessionStorage.getItem('userName');
        setUserName(name);
        if (!sessionData) {
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
                        <Image src={logo} alt='Logo' width={256} height={256} className='w-7 lg:w-8 h-auto' />
                        <h1 className='text-start text-base lg:text-xl text-blue-600 font-bold uppercase scale-y-150'>Shop</h1>
                    </Link>
                </div>

                <Link title='Change Password' href="/user" className='flex flex-col items-center justify-end leading-6'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 stroke-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M 1.696586,23.854911 C 1.4899619,23.703825 1.4675964,23.531004 1.5548543,22.759745 2.0019459,18.807978 4.738669,15.438265 8.6592892,14.012087 8.9003064,13.924414 8.8341224,13.847092 8.2157612,13.493933 7.8160092,13.265624 7.1212416,12.681667 6.6718334,12.196255 2.9616155,8.1887753 4.7547008,1.8128216 10.032287,0.24696423 c 1.009871,-0.2996271 2.915854,-0.30076119 3.93184,-0.00236 3.150012,0.92524407 5.357953,3.83815887 5.348807,7.05662697 -0.007,2.4672242 -1.453591,5.0054888 -3.527806,6.1901238 -0.621767,0.355103 -0.688865,0.433093 -0.448005,0.520711 2.744757,0.99844 4.852502,2.847555 6.057184,5.31393 0.964012,1.973652 1.401683,4.270586 0.870404,4.56791 -0.349343,0.195497 -0.770587,0.03652 -0.840471,-0.31717 C 21.39067,23.406965 21.287704,22.84722 21.19537,22.332867 20.61826,19.118002 18.311767,16.363875 15.258196,15.243437 9.8711369,13.266772 3.9157394,16.593728 2.8471042,22.176832 2.7322272,22.777006 2.6096496,23.406965 2.5747094,23.57674 2.4974609,23.9521 2.0314085,24.099724 1.696586,23.854894 Z m 13.059726,-11.15216 c 1.768254,-0.873919 2.951836,-2.486915 3.295034,-4.4904832 0.449692,-2.6252751 -0.994974,-5.326238 -3.477914,-6.502352 -0.919624,-0.435605 -1.081854,-0.4648907 -2.575225,-0.4648907 -1.495337,0 -1.654762,0.028886 -2.5811976,0.4676851 -3.8541879,1.8255093 -4.7424387,6.856435 -1.7411456,9.8616138 1.8852003,1.887639 4.6520602,2.328603 7.0804482,1.128427 z" />
                    </svg>
                    <p className='uppercase leading-4 mt-1'>{userName}</p>
                </Link>

            </div>



            <div id="leftMenu" onClick={menuHideHandler} className={`fixed ${menuPos} top-[60px] bottom-0 transition-all duration-500 z-40`}>
                <div className='w-[250px] h-[calc(100vh-60px)] pb-[100px] flex flex-col text-sm md:text-base bg-gray-100 border-r-2 border-gray-200 drop-shadow-xl overflow-auto'>
                    <LeftMenu />
                    <button onClick={logOutHandler} className='w-full text-start pl-8 hover:bg-gray-300 transition-all duration-500'>Logout</button>
                </div>
            </div>



            <div id="container" className='fixed left-0 top-[60px] right-0 bottom-0 flex'>
                <div id="leftBar" className="hidden lg:block w-[300px] h-[calc(100vh-60px)] pb-[100px] flex flex-col bg-gray-100 border-r-2 border-gray-200 drop-shadow-xl overflow-auto">
                    <LeftMenu />
                    <button onClick={logOutHandler} className='w-full text-start pl-8 hover:bg-gray-300 transition-all duration-500'>Logout</button>
                </div>



                <div className='w-full h-[calc(100vh-60px)] px-4 pt-4 pb-[100px] bg-white overflow-auto'>
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

        </>
    )

}




const MenuBar = ({ click }) => {
    return <button onClick={click} className='w-7 h-7 flex item-center'><svg xmlns="http://www.w3.org/2000/svg" fill='none' viewBox='0 0 30 30'>
        <path d="M2 8 L28 8 M2 15 L28 15 M2 22 L28 22"
            className="fill-none stroke-gray-500" style={{ strokeWidth: '4px' }} />
    </svg></button>
}
