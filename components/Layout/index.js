import { tabs } from "@/constants"
import { Tabs } from "../Tabs"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner } from "../Spinner";

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

            <div className="flex justify-center items-center my-4">
                <h1 className="text-2xl text-center font-medium">All Data from Remote Strapi</h1>
            </div>
            <Tabs
                data={tabs.MAIN}
                currentRoute={currentRoute}
                slug={slug}
                setCurrentRoute={setCurrentRoute}
                setSlug={setSlug}
            />
            {currentRoute.includes("media") ? (
                <Tabs
                    data={tabs.MEDIA}
                    currentRoute={currentRoute}
                    slug={slug}
                    setCurrentRoute={setCurrentRoute}
                    setSlug={setSlug}
                />
            ) : <></>}
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