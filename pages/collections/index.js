import { localAPIRoutes, strapiAPIRoutesForCollections } from "@/constants/api-routes";
import { getAllCollections } from "@/services/api-service";
import { useEffect, useState } from "react";
import axios from "axios";
import { normalizeData } from "@/services/helper";
import { Collection } from "@/components/Collection";
import { promiseStatuses } from "@/constants";
import { MessageBox } from "@/components/MessageBox";
import { Spinner } from "@/components/Spinner";

export default function CollectionsPage({ data, error }) {
    const [collections, setCollections] = useState([]);
    const [isRequestPending, setRequestFlag] = useState({});
    const [responseMessage, setResponseMessage] = useState({});
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        if (error) {
            const message = {
                message: error?.message ?? "Error in getting one or more Collection(s)",
                success: false
            };
            setResponseMessage(message);
        }
        setCollections(data);
        setShowLoader(false);
    }, []);

    const importAllCollections = async () => {
        const message = { ...responseMessage };
        const requestPending = { ...isRequestPending };
        const promises = [];
        requestPending[-1] = true;
        setRequestFlag(requestPending);
        try {
            for (let i = 0; i < collections.length; i++) {
                promises.push(axios.post(`${localAPIRoutes.CREATE_MANY}${strapiAPIRoutesForCollections[collections[i].title]}`, collections[i].data))
            }
            const res = await Promise.all(promises);
            if (res && res.length) {
                message[-1] = {
                    message: "All collections imported successfully!",
                    success: true
                };
                setResponseMessage(message);
            }
            requestPending[-1] = false;
            setRequestFlag(requestPending);
        } catch (e) {
            message[-1] = {
                message: e.message ? e.message : 'Error in importing collection(s)',
                success: false
            };
            setResponseMessage(message);
            requestPending[-1] = false;
            setRequestFlag(requestPending);
        }
    }

    const postDataToLocal = async (collectionName, index) => {
        const message = { ...responseMessage };
        const requestPending = { ...isRequestPending };
        requestPending[index] = true;
        setRequestFlag(requestPending);
        try {
            const res = await axios.post(`${localAPIRoutes.CREATE_MANY}${strapiAPIRoutesForCollections[collectionName]}`, collections[index].data);
            if (res.data && res.data.success) {
                message[index] = res.data;
                setResponseMessage(message);
            }
            requestPending[index] = false;
            setRequestFlag(requestPending);
        } catch (e) {
            message[index] = {
                message: e.message ? e.message : 'Error in inserting record(s)',
                success: false
            };
            setResponseMessage(message);
            requestPending[index] = false;
            setRequestFlag(requestPending);
        }
    }

    const closeMessageBox = (index) => {
        const message = { ...responseMessage };
        message[index] = {
            message: '',
            success: false
        };
        setResponseMessage(message);
    }

    return (
        <>
            {showLoader
                ? (
                    <div className="flex flex-col justify-center items-center min-h-[500px]">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4 mt-16 w-full">
                            <span className="text-xl font-bold p-1"></span>
                            {responseMessage[-1] && responseMessage[-1].message && (
                                <MessageBox response={responseMessage[-1]} closeMessageBox={closeMessageBox} index={-1} />
                            )}
                            <div className="flex justify-between items-center">
                                {isRequestPending[-1] ? <Spinner size="xs" color="primary" /> : <></>}
                                <button className={`bg-blue-700 text-white px-3 py-2 ml-2 rounded ${isRequestPending[-1] ? 'pointer-events-none cursor-wait' : ''}`} onClick={() => importAllCollections()}>Import All Collections</button>
                            </div>
                        </div>
                        {collections.map((collection, index) => {
                            return (
                                <div key={index}>
                                    <Collection
                                        data={collection}
                                        index={index}
                                        isRequestPending={isRequestPending}
                                        responseMessage={responseMessage}
                                        postDataToLocal={postDataToLocal}
                                        closeMessageBox={closeMessageBox}
                                    />
                                </div>
                            )
                        })}
                    </>
                )}
        </>
    )
}

export async function getServerSideProps() {
    const collectionNames = Object.keys(strapiAPIRoutesForCollections);
    const result = [];
    try {
        let resp = await getAllCollections();
        for (let i = 0; i < resp?.length; i++) {
            if (resp[i]?.status !== promiseStatuses.FULFILLED) {
                continue;
            }
            const item = resp[i]?.value?.data;
            if (item && item?.data) {
                result.push({
                    title: collectionNames[i],
                    data: normalizeData(item?.data)
                });
            }
        };

        return {
            props: { data: result ?? [] }
        }
    } catch (e) {
        return {
            props: {
                error: JSON.parse(JSON.stringify(e)),
            },
        };
    }
}
