import { REMOTE_STRAPI_BASE_PATH } from "@/constants/environment"
import { MessageBox } from "../MessageBox"
import { Spinner } from "../Spinner"

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
                <MessageBox response={responseMessage[index]} closeMessageBox={closeMessageBox} index={index} />
            )}
            <div className="flex justify-between items-center">

                {isRequestPending[index] ? <Spinner size="xs" color="primary" /> : <></>}
                <button className={`bg-green-700 text-white px-3 py-2 ml-2 rounded ${isRequestPending[index] ? 'pointer-events-none cursor-wait' : ''}`} onClick={() => postDataToLocal(data.title, index)}>Import</button>
            </div>
        </div>
    )
}