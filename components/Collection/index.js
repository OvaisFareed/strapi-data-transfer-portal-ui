import { REMOTE_STRAPI_BASE_PATH } from "@/constants/environment"
import { MessageBox } from "../MessageBox";
import { Spinner } from "../Spinner";

export const Collection = ({
    data,
    index,
    isRequestPending,
    responseMessage,
    postDataToLocal,
    closeMessageBox,
}) => {
    const dataLength = data?.data && data?.data?.length ? data?.data?.length : 0;
    return (
        <>
            <div className="flex justify-between items-center mb-4 mt-16 w-full">
                <span className="text-xl font-bold p-1">{data.title} ({dataLength})</span>
                {responseMessage[index] && responseMessage[index].message && (
                    <MessageBox response={responseMessage[index]} closeMessageBox={closeMessageBox} index={index} />
                )}
                {dataLength ? (
                    <div className="flex justify-between items-center">

                        {isRequestPending[index] ? <Spinner size="xs" color="primary" /> : <></>}
                        <button className={`bg-green-700 text-white px-3 py-2 ml-2 rounded ${isRequestPending[index] ? 'pointer-events-none cursor-wait' : ''}`} onClick={() => postDataToLocal(data.title, index)}>Import</button>
                    </div>
                ) : <></>}
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
                    {dataLength ? (
                        <tbody>
                            {data?.data?.map((item, i) => {
                                return (
                                    <tr key={i}>
                                        <td className="w-1/12 border border-slate-300 text-center font-medium">{i + 1}</td>
                                        {item.image ?
                                            <td className="border border-slate-300 text-center w-[70px] h-[70px] p-2">
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
                                            : <td className="border border-slate-300 text-center w-[70px] h-[70px] p-2">
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
                    ) : <tbody className="text-center">
                        <tr>
                            <td colSpan={3}>No records found</td>
                        </tr>
                    </tbody>}
                </table>
            </div>
        </>
    )
}