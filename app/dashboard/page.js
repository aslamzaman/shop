
import Image from "next/image";
import logo from "@/public/images/logo/shop.png";



const Panel = ({ title, amount }) => {
    return (<div className="w-full flex flex-col border-2 border-gray-300 shadow-lg rounded-lg">
        <div className="w-full py-2 text-gray-600 text-center font-bold bg-gray-100 drop-shadow-md border-b border-gray-300 rounded-t-lg">{title}</div>
        <div className="w-full py-6 text-center font-bold text-gray-700 scale-y-150">{amount}</div>
    </div>)
}


const Dashboard = () => {
    return (
        <div className="w-full mt-6">

            <Image src={logo} alt="logo" width={1875} height={1206} className="w-64 h-auto mx-auto" />

            <h1 className="w-full py-4 text-xl lg:text-4xl font-bold text-center text-blue-700 leading-6">SHOPDATABASE<br /> <span className="text-xl text-blue-400">Super-easy storage system</span><br /><span className="text-sm text-green-500 animate-pulse">No need to write notes again and again. You will find all your accounting calculations here.</span></h1>

            <p className="w-full py-2 text-center border border-gray-200">1. You can get a <span className="font-bold">Username and Password</span> at any time. For this, you will have to pay a small subscription fees.</p>
            <p className="w-full py-2 text-center border border-gray-200">2. You will see the <span className="font-bold">Settings</span> menu on the left side. Here there are <span className="font-bold">Customers, Vendors and Products</span> sub-menus.</p>
            <p className="w-full py-2 text-center border border-gray-200">3. Click on the sub menu. To add information, click on the blue button with a plus sign. Fill in all the information and save. Fill in all sub menus in this way.</p>
            <p className="w-full py-2 text-center border border-gray-200">4. In the same way, you can easily <span className="font-bold">Purchases and Sales</span> products. You can easily make payment from the <span className="font-bold">Payments</span> menu.
                Enjoy the information from all the other menus.</p>




        </div>
    );
}
export default Dashboard;
