// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

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
        const noOfPages = Math.round((totalItemsCount) / itemsPerPage);

        /*********************
        Promise.all approach
        **********************/
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
            const files = results.filter(f => f.status === 'fulfilled');
            const rejected = results.filter(f => f.status === 'rejected');
            missedFiles = missedFiles.concat(rejected);
            files.forEach((res, index) => {
                const file = filesHash[res?.value?.config?.url];
                const blob = new Blob([res.value.data], {
                    type: file.mime
                });
                formData.append(`files`, blob, file.name);
            });
            if (count < noOfPages) {
                console.log(`${(count * 100) + 100} files uploaded`);
                await uploadAllMedia(`${path}`, formData);
            }
            if (count === noOfPages - 1) {
                console.log('missedFiles count: ', missedFiles.length);
                console.log('Job finished!');
                break;
            }
        }

        // Upload missed / rejected files
        for (let count = 0; count < missedFiles.length; count++) {
            promises = [];
            formData = new FormData();
            for (let i = 0; i < missedFiles.length; i++) {
                file = missedFiles[i];
                imageUrl = `${REMOTE_STRAPI_BASE_PATH}${file.url}`;
                filesHash[imageUrl] = file;
                promises.push(axios.get(imageUrl, { responseType: "arraybuffer" }));
            }
            const results = await Promise.allSettled(promises);
            const files = results.filter(f => f.status === 'fulfilled');
            files.forEach((res, index) => {
                const file = filesHash[res?.value?.config?.url];
                const blob = new Blob([res.value.data], {
                    type: file.mime
                });
                formData.append(`files`, blob, file.name);
            });
            if (count < missedFiles.length) {
                console.log(`${(count * 100) + 100} files uploaded`);
                await uploadAllMedia(`${path}`, formData);
            }
            if (count === missedFiles.length - 1) {
                console.log('missed files Job finished!');
                break;
            }
        }
        res.status(200).json({ success: true, message: "All media uploaded successfully!" });

    } catch (error) {
        console.log('uploadAllMedia err: ', error)
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
            sizeLimit: '500mb' // Set desired value here
        }
    }
}
