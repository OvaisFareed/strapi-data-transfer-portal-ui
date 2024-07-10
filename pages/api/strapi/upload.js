// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { promiseStatuses } from "@/constants";
import { REMOTE_STRAPI_BASE_PATH } from "@/constants/environment";
import { uploadAllMedia } from "@/services/api-service";
import axios from "axios";

export default async function handler(req, res) {
    try {
        const { path } = req.query;
        const payload = req.body;
        let formData = new FormData();
        let imageUrl = '';
        let file = {};
        let filesHash = {};
        let promises = [];
        let missedFiles = [];
        const itemsPerPage = 100;
        const totalItemsCount = payload.length;
        const noOfPages = totalItemsCount <= 100 ? 1 : Math.round((totalItemsCount) / itemsPerPage);

        // Upload media page by page (100 items) in each iteration
        for (let count = 0; count < noOfPages; count++) {
            promises = [];
            formData = new FormData();
            const images = payload.slice(count * itemsPerPage, (count * itemsPerPage) + itemsPerPage);
            for (let i = 0; i < images.length; i++) {
                file = images[i];
                imageUrl = `${REMOTE_STRAPI_BASE_PATH}${file.url}`;
                filesHash[imageUrl] = file;
                promises.push(axios.get(imageUrl, { responseType: "arraybuffer" }));
            }
            const results = await Promise.allSettled(promises);
            const files = results.filter(f => f.status === promiseStatuses.FULFILLED);
            const rejected = results.filter(f => f.status === promiseStatuses.REJECTED);
            missedFiles = missedFiles.concat(rejected.map(file => {
                return { url: file?.reason?.config?.url }
            }));
            files.forEach((res, index) => {
                const file = filesHash[res?.value?.config?.url];
                const blob = new Blob([res.value.data], {
                    type: file.mime
                });
                formData.append(`files`, blob, file.name);
            });
            if (count < noOfPages) {
                await uploadAllMedia(`${path}`, formData);
            }
            if (count === noOfPages - 1) {
                console.log('missed files: ', missedFiles.length);
                console.log('Job finished!');
                break;
            }
        }

        // Upload missed / rejected files
        for (let count = 0; count < missedFiles.length; count++) {
            promises = [];
            formData = new FormData();
            const missed = missedFiles.slice(count * itemsPerPage, (count * itemsPerPage) + itemsPerPage);

            for (let i = 0; i < missed.length; i++) {
                file = missed[i];
                imageUrl = `${REMOTE_STRAPI_BASE_PATH}${file.url}`;
                filesHash[imageUrl] = file;
                promises.push(axios.get(imageUrl, { responseType: "arraybuffer" }));
            }
            const results = await Promise.allSettled(promises);
            const files = results.filter(f => f.status === 'fulfilled');
            files.forEach((res, index) => {
                const file = filesHash[res?.value?.config?.url];
                const blob = new Blob([res.value.data], {
                    type: file.mime ?? ""
                });
                formData.append(`files`, blob, file.name ?? "");
            });
            if (count < missed.length) {
                await uploadAllMedia(`${path}`, formData);
            }
            if (count === missed.length - 1) {
                console.log('missed files Job finished!');
                break;
            }
        }
        res.status(200).json({ success: true, message: "All media uploaded successfully!" });

    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error && error.response
                    ? error.response.data
                    : "Internal Server Error.",
        });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '500mb'
        }
    }
}
