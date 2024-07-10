import { localAPIRoutes, strapiAPIRoutesForSingleTypes } from "@/constants/api-routes";
import { getAllCollections } from "@/services/api-service";
import { useEffect, useState } from "react";
import axios from "axios";
import { normalizeData } from "@/services/helper";
import { SingleType } from "@/components/SingleType";
import { promiseStatuses } from "@/constants";

export default function SingleTypesPage({ data, error }) {
    const [collections, setCollections] = useState([]);
    const [isRequestPending, setRequestFlag] = useState(false);
    const [responseMessage, setResponseMessage] = useState({});


    useEffect(() => {
        if (error) {
            const message = {
                message: error?.message ?? "Error in getting one or more Single Type(s)",
                success: false
            };
            setResponseMessage(message);
        }
        setCollections(data)
    }, []);

    const importAllCollections = async () => {
        const message = { ...responseMessage };
        const promises = [];
        setRequestFlag(true);
        try {
            for (let i = 0; i < collections.length; i++) {
                promises.push(axios.post(`${localAPIRoutes.UPDATE}${strapiAPIRoutesForSingleTypes[collections[i].title]}`, collections[i].data))
            }
            const res = await Promise.all(promises);
            if (res && res.length) {
                message[-1] = {
                    message: "All Single Types are imported successfully!",
                    success: true
                };
                setResponseMessage(message);
            }
            setRequestFlag(false);
        } catch (e) {
            message[-1] = {
                message: e.message ? e.message : 'Error in inserting record(s)',
                success: false
            };
            setResponseMessage(message);
            setRequestFlag(false);
        }
    }

    const postDataToLocal = async (collectionName, index) => {
        const message = { ...responseMessage };
        setRequestFlag(true);
        try {
            const res = await axios.post(`${localAPIRoutes.UPDATE}${strapiAPIRoutesForSingleTypes[collectionName]}`, collections[index].data);
            console.log('postDataToLocal res: ', res)
            if (res.data && res.data.success) {
                message[index] = res.data;
                setResponseMessage(message);
            }
            setRequestFlag(false);
        } catch (e) {
            console.log('postDataToLocal err: ', e)
            message[index] = {
                message: e.message ? e.message : 'Error in inserting record',
                success: false
            };
            setResponseMessage(message);
            setRequestFlag(false);
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
            <div className="flex justify-between items-center mb-4 mt-16 w-full">
                <span className="text-xl font-bold p-1"></span>
                {responseMessage[-1] && responseMessage[-1].message && (
                    <span className={`flex justify-between items-center ml-4 px-3 py-2 w-[350px] rounded ${responseMessage[-1].success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {responseMessage[-1].message}

                        <span className="text-black font-medium cursor-pointer" onClick={() => closeMessageBox(-1)}>x</span>
                    </span>
                )}
                <div>
                    <button className={`bg-blue-700 text-white px-3 py-2 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`} onClick={() => importAllCollections()}>Import All Single Types</button>
                </div>
            </div>
            {collections.map((collection, index) => {
                return (
                    <div key={index}>
                        <SingleType
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
    )
}

export async function getServerSideProps() {
    const collectionNames = Object.keys(strapiAPIRoutesForSingleTypes);
    const result = [];
    try {
        let resp = await getAllCollections('S');
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
