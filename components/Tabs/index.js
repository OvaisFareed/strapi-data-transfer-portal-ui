import Link from "next/link";

export const Tabs = ({ data, currentRoute, slug, setCurrentRoute, setSlug }) => {
    return (
        <div className="flex justify-center items-center my-4">
            {data.map(d => {
                return (
                    <Link
                        href={d.link}
                        onClick={() => { setCurrentRoute(d.link), setSlug(d.slug) }}
                    >
                        <div
                            className={`text-center p-2 w-[140px] border-b-[2px] ${slug === d.slug || currentRoute.includes(d.slug) ? "bg-gray-100 border-b-[#000]" : "bg-gray-300 border-b-gray-300 text-gray-500"}`}
                        >
                            <h2 className={`text-xl text-center font-medium`}>{d.label}</h2>
                        </div>
                    </Link>
                )
            })}
        </div>
    );
}