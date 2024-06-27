import { localAPIRoutes, strapiAPIRoutesForSingleTypes } from "@/constants/api-routes";
import { getAllCollections } from "@/services/api-service";
import { useEffect, useState } from "react";
import axios from "axios";
import { normalizeData } from "@/services/helper";
import { SingleType } from "@/components/SingleType";

export default function SingleTypesPage({ data, error }) {
    const [collections, setCollections] = useState([]);
    const [isRequestPending, setRequestFlag] = useState(false);
    const [responseMessage, setResponseMessage] = useState({});


    useEffect(() => {
        if (error) {
            console.log('error on url: ', error?.config?.url)
            throw new Error(error?.message);
        }
        setCollections(data)
    }, []);

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
        const resp = await getAllCollections('S');
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
