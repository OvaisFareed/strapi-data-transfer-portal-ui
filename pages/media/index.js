import { localAPIRoutes, mediaAPIRoutes, strapiAPIRoutesForSingleTypes } from "@/constants/api-routes";
import { getAllMedia } from "@/services/api-service";
import { useEffect, useState } from "react";
import axios from "axios";
import { normalizeData } from "@/services/helper";
import { SingleType } from "@/components/SingleType";
import Image from "next/image";
import { REMOTE_STRAPI_BASE_PATH } from "@/constants/environment";

export default function MediaPage({ data, error }) {
    const [images, setImages] = useState([]);
    const [isRequestPending, setRequestFlag] = useState(false);
    const [responseMessage, setResponseMessage] = useState({});


    useEffect(() => {
        if (error) {
            console.log('error on url: ', error?.config?.url)
            throw new Error(error?.message);
        }
        console.log('all media: ', data)
        if (data && data.length) {
            data = data.filter(d => d.mime !== 'application/pdf');
            setImages(data);
        }
    }, []);

    const postDataToLocal = async () => {
        let message = { ...responseMessage };
        setRequestFlag(true);
        try {
            const res = await axios.post(`${localAPIRoutes.UPLOAD}${mediaAPIRoutes.POST}`, images);
            console.log('postDataToLocal res: ', res)
            if (res.data && res.data.success) {
                message = res.data;
                setResponseMessage(message);
            }
            setRequestFlag(false);
        } catch (e) {
            console.log('postDataToLocal err: ', e)
            message = {
                message: e.message ? e.message : 'Error in inserting record',
                success: false
            };
            setResponseMessage(message);
            setRequestFlag(false);
        }
    }

    const emptyLocalCollection = async () => {
        setRequestFlag(true);
        try {
            const res = await axios.delete(`${localAPIRoutes.DELETE_ALL_MEDIA}${mediaAPIRoutes.GET}`);
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

    const closeMessageBox = () => {
        let message = { ...responseMessage };
        message = {
            message: '',
            success: false
        };
        setResponseMessage(message);
    }

    return (
        <>
            <div className="flex justify-between items-center mb-8 mr-4 mt-16 w-full">
                <div>
                    <button className={`bg-green-700 text-white px-3 py-1 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`}
                        onClick={() => postDataToLocal()}
                    >
                        Upload all assests
                    </button>
                    <button className={`bg-red-700 text-white ml-2 px-3 py-1 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`}
                        onClick={() => emptyLocalCollection()}
                    >
                        Delete all local media
                    </button>
                </div>
                {responseMessage && responseMessage.message && (
                    <span className={`flex justify-between items-center ml-4 px-3 py-1 w-[350px] rounded ${responseMessage.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {responseMessage.message}

                        <span className="text-black font-medium cursor-pointer" onClick={() => closeMessageBox()}>x</span>
                    </span>
                )}
                <span className="text-xl font-bold p-1"></span>

            </div>
            <div className="flex flex-wrap">
                {images.map((image, index) => {
                    return (
                        <Image
                            src={`${REMOTE_STRAPI_BASE_PATH}${image?.url}`}
                            alt={image?.alt}
                            width={100}
                            height={100}
                            key={index}
                            className="m-2"
                        />
                    )
                })}
            </div>
        </>
    )
}

export async function getServerSideProps() {
    try {
        const resp = await getAllMedia();
        return {
            props: { data: resp ?? [] }
        }
    } catch (e) {
        return {
            props: {
                error: JSON.parse(JSON.stringify(e)),
            },
        };
    }
}
