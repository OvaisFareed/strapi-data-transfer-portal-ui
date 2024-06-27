import { REMOTE_STRAPI_BASE_PATH } from "@/constants/environment"

export const SingleType = ({
    data,
    index,
    isRequestPending,
    responseMessage,
    postDataToLocal,
    closeMessageBox,
}) => {
    return (
        <div className="flex justify-between items-center mb-4 mt-16 w-full">
            <span className="text-xl font-bold p-1">{data.title}</span>
            {responseMessage[index] && responseMessage[index].message && (
                <span className={`flex justify-between items-center ml-4 px-3 py-1 w-[350px] rounded ${responseMessage[index].success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {responseMessage[index].message}

                    <span className="text-black font-medium cursor-pointer" onClick={() => closeMessageBox(index)}>x</span>
                </span>
            )}
            <div>
                <button className={`bg-green-700 text-white px-3 py-1 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`} onClick={() => postDataToLocal(data.title, index)}>Import to Local</button>
                {/* <button className={`bg-red-700 text-white ml-2 px-3 py-1 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`} onClick={() => emptyLocalCollection()}>Empty Local Collection</button> */}
            </div>
        </div>
    )
}