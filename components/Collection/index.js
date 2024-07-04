import { REMOTE_STRAPI_BASE_PATH } from "@/constants/environment"

export const Collection = ({
    data,
    index,
    isRequestPending,
    responseMessage,
    postDataToLocal,
    closeMessageBox,
}) => {
    return (
        <>
            <div className="flex justify-between items-center mb-4 mt-16 w-full">
                <span className="text-xl font-bold p-1">{data.title}</span>
                {responseMessage[index] && responseMessage[index].message && (
                    <span className={`flex justify-between items-center ml-4 px-3 py-2 w-[350px] rounded ${responseMessage[index].success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {responseMessage[index].message}

                        <span className="text-black font-medium cursor-pointer" onClick={() => closeMessageBox(index)}>x</span>
                    </span>
                )}
                <div>
                    <button className={`bg-green-700 text-white px-3 py-2 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`} onClick={() => postDataToLocal(data.title, index)}>Import</button>
                </div>
            </div>
            <div className="max-h-[308px] overflow-y-scroll w-full mb-8">
                <table className="table-auto border-collapse border border-slate-400 w-full">
                    <thead className="bg-[#eee]">
                        <tr>
                            <th className="w-1/12 border border-slate-300">S No.</th>
                            <th className="w-1/12 border border-slate-300">Image</th>
                            <th className="w-4/6 border border-slate-300">Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data?.map((item, i) => {
                            return (
                                <tr key={i}>
                                    <td className="w-1/12 border border-slate-300 text-center font-medium">{i + 1}</td>
                                    {item.image ?
                                        <td className="w-1/12 border border-slate-300 text-center w-[70px] h-[70px] p-2">
                                            <span style={{
                                                backgroundImage: `url(${REMOTE_STRAPI_BASE_PATH}${item.image?.url})`,
                                                height: "50px",
                                                width: "50px",
                                                backgroundRepeat: "no-repeat",
                                                borderRadius: "50%",
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                display: "block"
                                            }}></span>
                                        </td>
                                        : <td className="w-1/12 border border-slate-300 text-center w-[70px] h-[70px] p-2">
                                            <span>-</span>
                                        </td>}
                                    <td className="w-4/6 border border-slate-300 pl-1">{
                                        item?.title ?? item?.label ?? item?.name ?? item?.secondary ??
                                        (item?.source && item?.slug ? `${item.slug} - ${item.source}` : item?.source) ?? item?.currency_name
                                    }</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}