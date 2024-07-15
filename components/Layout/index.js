import { tabs } from "@/constants"
import { Tabs } from "../Tabs"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner } from "../Spinner";
import { HomeComp } from "../Home";
import Link from "next/link";
import { appRoutes } from "@/constants/app-routes";
import Image from "next/image";

export const Layout = ({ children }) => {
    const router = useRouter();
    const [currentRoute, setCurrentRoute] = useState(router.asPath);
    const [slug, setSlug] = useState(router.query.slug);
    const [showLoader, setShowLoader] = useState(true);


    useEffect(() => {
        setShowLoader(false);
    }, [])

    return (
        <main className="min-h-screen p-4 container mx-auto bg-[#fff] w-full">
            <div className="flex justify-between items-center mt-4 mb-8">
                <Link className="flex items-center hover:underline" href={appRoutes.HOME.link}>
                    <Image
                        src={"/images/arrow-back.svg"}
                        alt={""}
                        width={20}
                        height={20}
                        className="mr-2"
                    />
                    <h2 className={`text-md text-center font-medium`}>Back to Home</h2>
                </Link>
                <h1 className="text-2xl text-center font-medium">All Data from Remote Strapi</h1>
                <div className="w-[90px]"></div>
            </div>
            <Tabs
                data={tabs.MAIN}
                currentRoute={currentRoute}
                slug={slug}
                setCurrentRoute={setCurrentRoute}
                setSlug={setSlug}
            />
            {showLoader
                ? (
                    <div className="flex flex-col justify-center items-center min-h-[500px]">
                        <Spinner />
                    </div>
                ) : (
                    children
                )}

        </main>
    )
}