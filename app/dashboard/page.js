
import Image from "next/image";
import dashboard from "@/public/images/landing/landing.png";

const Dashboard = ()=>{
    return (
        <>
            <h1 className="w-full py-4 text-xl lg:text-3xl font-bold text-center text-blue-700">Welcome</h1>
            <div className="w-full lg:w-3/4 mx-auto border-2 border-gray-300 shadow-md rounded-md overflow-auto">
                <Image src={dashboard} alt="dashboard" width={399.1} height={261.8} priority={true} className="w-full h-auto mx-auto" />
            </div>

        </>
    );
}
export default Dashboard;