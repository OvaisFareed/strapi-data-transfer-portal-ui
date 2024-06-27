import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export const Tabs = () => {
    const router = useRouter();
    const [currentRoute, setCurrentRoute] = useState(router.pathname);

    return (
        <div className="flex justify-center items-center my-4">

            <Link
                href={"/collections"}
                onClick={() => setCurrentRoute("/collections")}
            >
                <div
                    className={`text-center p-2 w-[140px] border-b-[2px] ${currentRoute?.includes("collections") ? "bg-gray-100 border-b-[#000]" : "bg-gray-300 border-b-gray-300 text-gray-500"}`}
                >
                    <h2 className={`text-xl text-center font-medium`}>Collections</h2>
                </div>
            </Link>
            <Link
                href={"/single-types"}
                onClick={() => setCurrentRoute("/single-types")}
            >
                <div
                    className={`text-center p-2 w-[140px] border-b-[2px] ${currentRoute?.includes("single-types") ? "bg-gray-100 border-b-[#000]" : "bg-gray-300 border-b-gray-300 text-gray-500"}`}
                >
                    <h2 className={`text-xl text-center font-medium`}>Single Types</h2>
                </div>
            </Link>
            <Link
                href={"/media"}
                onClick={() => setCurrentRoute("/media")}
            >
                <div
                    className={`text-center p-2 w-[140px] border-b-[2px] ${currentRoute?.includes("media") ? "bg-gray-100 border-b-[#000]" : "bg-gray-300 border-b-gray-300 text-gray-500"}`}
                >
                    <h2 className={`text-xl text-center font-medium`}>Media</h2>
                </div>
            </Link>
        </div>
    );
}