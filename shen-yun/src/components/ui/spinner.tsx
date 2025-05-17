import {LoaderCircle} from "lucide-react";

export default function LoadingScreen() {
    return (
        // <div className="flex min-h-screen items-center justify-center bg-[#202C39] text-[#FAFFEB]">
        //     {/*<div className="flex flex-col items-center">*/}
        //     {/*    <LoaderCircle className="h-12 w-12 animate-spin text-[#ED7E07]" />*/}
        //     {/*    <p className="mt-4 text-lg font-semibold">Loado Modo...</p>*/}
        //     {/*</div>*/}
        // </div>
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#202C39] text-[#FAFFEB]">
        {/* "Loado Modo" Text */}
        <h1 className="text-2xl font-bold mb-4 tracking-wide ">
            Loado Modo
        </h1>

        {/* Bouncing Dots Animation */}
        <div className="flex space-x-2">
            <div className="h-4 w-4 animate-bounce bg-[#ED7E07] rounded-full"></div>
            <div className="h-4 w-4 animate-bounce bg-[#ED7E07] rounded-full delay-150"></div>
            <div className="h-4 w-4 animate-bounce bg-[#ED7E07] rounded-full delay-300"></div>
        </div>
    </div>
    );
}

{/* ... */}
