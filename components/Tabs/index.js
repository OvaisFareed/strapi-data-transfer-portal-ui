import Link from "next/link";
import { useRouter } from "next/router";

export const Tabs = () => {
    const router = useRouter();

    return (
        <div className="flex justify-center items-center my-4">
            <Link className={`p-2 ${router.pathname?.includes("collections") ? "border-b-[red]" : ""}`} href={"/collections"}>
                <h2 className={`text-xl text-center font-medium`}>Collections</h2>
            </Link>
            <Link className={`p-2 ${router.pathname?.includes("single-types") ? "active" : ""}`} href={"/single-types"}>
                <h2 className={`text-xl text-center font-medium`}>Single Types</h2>
            </Link>
        </div>
    );
}