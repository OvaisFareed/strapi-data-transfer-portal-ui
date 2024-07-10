import { localAPIRoutes, mediaAPIRoutes } from "@/constants/api-routes";
import { getAllMedia } from "@/services/api-service";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { REMOTE_STRAPI_BASE_PATH } from "@/constants/environment";
import { useRouter } from "next/router";
import { Spinner } from "@/components/Spinner";
import { MessageBox } from "@/components/MessageBox";
import { Tabs } from "@/components/Tabs";
import { tabs } from "@/constants";

export default function MediaPage({ data, error }) {
    const router = useRouter();
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [isRequestPending, setRequestFlag] = useState(false);
    const [responseMessage, setResponseMessage] = useState({});
    const [currentRoute, setCurrentRoute] = useState(router.asPath);
    const [slug, setSlug] = useState(router.query.slug);

    useEffect(() => {
        if (error) {
            const message = {
                message: error?.message ?? "Error in getting media",
                success: false
            };
            setResponseMessage(message);
        }
        if (data && data.length) {
            const images = data.filter(d => d.ext !== '.pdf' && d.ext !== '.xml');
            const files = data.filter(d => d.ext === '.pdf' || d.ext === '.xml');
            setImages(images);
            setFiles(files);
        }
    }, []);

    const postDataToLocal = async (mediaFiles) => {
        let message = { ...responseMessage };
        setRequestFlag(true);
        try {
            const res = await axios.post(`${localAPIRoutes.UPLOAD}${mediaAPIRoutes.POST}`, mediaFiles);
            if (res.data && res.data.success) {
                message = res.data;
                setResponseMessage(message);
            }
            setRequestFlag(false);
        } catch (e) {
            message = {
                message: e.message ? e.message : 'Error in inserting record',
                success: false
            };
            setResponseMessage(message);
            setRequestFlag(false);
        }
    }

    const updateMediaInfo = async () => {
        let message = { ...responseMessage };
        setRequestFlag(true);
        try {
            const res = await axios.post(`${localAPIRoutes.UPDATE_MEDIA_INFO}${mediaAPIRoutes.POST}&id=36708`, {
                alternativeText: '',
            });
            if (res.data && res.data.success) {
                message = res.data;
                setResponseMessage(message);
            }
            setRequestFlag(false);
        } catch (e) {
            message = {
                message: e.message ? e.message : 'Error in updating media info',
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
            <Tabs
                data={tabs.MEDIA}
                currentRoute={currentRoute}
                slug={slug}
                setCurrentRoute={setCurrentRoute}
                setSlug={setSlug}
            />
            {currentRoute.includes("images") ? (
                <>
                    <div className="flex justify-between items-center mb-8 mr-4 mt-16 w-full">
                        <span className="text-xl font-bold p-1"></span>
                        {responseMessage && responseMessage.message && (
                            <MessageBox response={responseMessage} closeMessageBox={closeMessageBox} />
                        )}

                        <div className="flex justify-between items-center">
                            <button className={`bg-green-700 text-white px-3 py-2 mr-2 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`}
                                onClick={() => postDataToLocal(images)}
                            >
                                Import all Images
                            </button>
                            {isRequestPending ? <Spinner size="xs" color="primary" /> : <></>}
                        </div>
                        {/* 
                            <div>
                            <button className={`bg-red-700 text-white ml-2 px-3 py-2 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`}
                                onClick={() => emptyLocalCollection()}
                            >
                                Delete all assests
                            </button> */}
                        {/* <button className={`bg-blue-700 text-white ml-2 px-3 py-2 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`}
                        onClick={() => updateMediaInfo()}
                    >
                        Update media info
                    </button>
                    </div>
                    */}
                    </div>
                    <div className="flex flex-wrap">
                        {images.map((image, index) => {
                            return (
                                <Image
                                    src={`${REMOTE_STRAPI_BASE_PATH}${image?.url}`}
                                    alt={image?.alt ?? ""}
                                    width={100}
                                    height={100}
                                    key={index}
                                    className="m-2 ml-6"
                                />
                            )
                        })}
                    </div>
                </>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-8 mr-4 mt-16 w-full">
                        {/* 
                        <div>
                        <button className={`bg-red-700 text-white ml-2 px-3 py-2 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`}
                                onClick={() => emptyLocalCollection()}
                            >
                                Delete all local media
                            </button> */}
                        {/* <button className={`bg-blue-700 text-white ml-2 px-3 py-2 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`}
                            onClick={() => updateMediaInfo()}
                        >
                            Update media info
                        </button>
                        </div>
                        */}
                        <span className="text-xl font-bold p-1"></span>
                        {responseMessage && responseMessage.message && (
                            <MessageBox response={responseMessage} closeMessageBox={closeMessageBox} />
                        )}
                        <div className="flex justify-between items-center">
                            <button className={`bg-green-700 text-white px-3 py-2 mr-2 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`}
                                onClick={() => postDataToLocal(files)}
                            >
                                Import all Files
                            </button>
                            {isRequestPending ? <Spinner size="xs" color="primary" /> : <></>}
                        </div>
                    </div>
                    <div className="flex flex-wrap">
                        {files.map((file, index) => {
                            return (
                                <div className="m-2 ml-8">
                                    <div className="w-[250px] flex justify-center">

                                        <Image
                                            src={"/images/file.svg"}
                                            alt={file.name ?? ""}
                                            width={100}
                                            height={100}
                                            key={index}
                                            className="m-2"
                                        />
                                    </div>
                                    <div className="w-[250px] flex justify-center">
                                        <p className="truncate">{file.name}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
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
