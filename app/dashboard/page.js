
import Image from "next/image";
import logo from "@/public/images/logo/shop.png";



const Panel = ({title, amount})=>{
    return( <div className="w-full flex flex-col border-2 border-gray-300 shadow-lg rounded-lg">
        <div className="w-full py-2 text-gray-600 text-center font-bold bg-gray-100 drop-shadow-md border-b border-gray-300 rounded-t-lg">{title}</div>
        <div className="w-full py-6 text-center font-bold text-gray-700 scale-y-150">{amount}</div>
    </div>)
}


const Dashboard = () => {
    return (
        <div className="w-full mt-6">

            <Image src={logo} alt="logo" width={1875} height={1206} className="w-64 h-auto mx-auto" />

            <h1 className="w-full py-4 text-xl lg:text-4xl font-bold text-center text-blue-700 leading-6">SHOPDATABASE<br /> <span className="text-xl text-blue-400">Super-easy storage system</span><br /><span className="text-sm text-green-500 animate-pulse">You don't need a shop note book. We provide all your accounts.</span></h1>
            <div className="p-4 w-full grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-auto">
               <Panel title="Customers" amount="500" />
               <Panel title="Vendors" amount="300" />
               <Panel title="Product" amount="40" />
               <Panel title="Dues" amount="5000000" />
               <Panel title="Purchase" amount="4000000" />
               <Panel title="Sales" amount="5000000" />
               <Panel title="Income" amount="5000000" />
               <Panel title="Status" amount="Up" />
             
            </div>

        </div>
    );
}
export default Dashboard;
