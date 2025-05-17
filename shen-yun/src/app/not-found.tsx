import React from 'react';
import Navbar from "@/components/Navbar";

const NotFound: React.FC = () => {
    return (
        <div className="bg-[#202C39] min-h-screen flex flex-col items-center p-6">
            <div className="w-full">
                <Navbar />
            </div>
            <div className="bg-gray-700 p-8 mt-10 rounded-xl shadow-md w-[400px] text-center">
                <h1 className="text-[#FAFFEB] text-4xl mb-4">404</h1>
                <p className="text-[#FAFFEB] text-lg">Page Not Found</p>
            </div>
        </div>
    );
};

export default NotFound;