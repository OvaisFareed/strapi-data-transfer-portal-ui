import { Tabs } from "../Tabs"

export const Layout = ({ children }) => {
    return (
        <main className="min-h-screen p-4 container mx-auto bg-[#fff] w-full">
            <div className="flex justify-center items-center my-4">
                <h1 className="text-2xl text-center font-medium">All Data from Remote Strapi</h1>
            </div>
            <Tabs />
            {children}
        </main>
    )
}