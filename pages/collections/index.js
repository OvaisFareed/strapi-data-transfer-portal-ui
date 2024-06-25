import { localAPIRoutes, strapiAPIRoutes } from "@/constants/api-routes";
import { getAllData } from "@/services/api-service";
import { useEffect, useState } from "react";
import axios from "axios";
import { normalizeData } from "@/services/helper";
import { Collection } from "@/components/Collection";

export default function CollectionsPage({ data, error }) {
    const [collections, setCollections] = useState([]);
    const [isRequestPending, setRequestFlag] = useState(false);
    const [responseMessage, setResponseMessage] = useState({});


    useEffect(() => {
        if (error) {
            console.log('error on url: ', error?.config?.url)
            throw new Error(error?.message);
        }
        console.log('data: ', data)
        setCollections(data)
    }, []);

    const postDataToLocal = async (collectionName, index) => {
        const message = { ...responseMessage };
        setRequestFlag(true);
        try {
            const res = await axios.post(`${localAPIRoutes.CREATE_MANY}${strapiAPIRoutes[collectionName]}`, collections[index].data);
            if (res.data && res.data.success) {
                message[index] = res.data;
                setResponseMessage(message);
            }
            setRequestFlag(false);
        } catch (e) {
            message[index] = {
                message: e.message ? e.message : 'Error in inserting record(s)',
                success: false
            };
            setResponseMessage(message);
            setRequestFlag(false);
        }
    }

    const emptyLocalCollection = async () => {
        setRequestFlag(true);
        try {
            const res = await axios.delete(`${localAPIRoutes.DELETE_MANY}${strapiAPIRoutes.BANNER}`);
            if (res.data && res.data.success) {
                setResponseMessage(res.data);
            }
            setRequestFlag(false);
        } catch (e) {
            setResponseMessage({
                message: e.message ? e.message : 'Error in deleting record(s)',
                success: false
            });
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
    )
}

export async function getServerSideProps() {
    const collectionNames = Object.keys(strapiAPIRoutes);
    const result = [];
    try {
        const resp = await getAllData();
        for (let i = 0; i < resp?.length; i++) {
            if (resp[i].data && resp[i].data.data) {
                result.push({
                    title: collectionNames[i],
                    data: normalizeData(resp[i].data.data)
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
