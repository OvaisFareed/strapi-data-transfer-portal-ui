// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { REMOTE_STRAPI_BASE_PATH } from "@/constants/environment";
import { uploadAllMedia } from "@/services/api-service";
import axios from "axios";
import * as fs from 'fs';
import * as filePath from 'path';
import RunQueue from "run-queue";
import * as Parallel from 'async-parallel';

export default async function handler(req, res) {
    try {
        const { path } = req.query;
        const payload = req.body;
        const formData = new FormData();
        let count = 0;
        let intervalID = '';
        let imageUrl = '';
        let file = {};
        let filesHash = {};
        let promises = [];
        let promisesV2 = [];
        let missedFiles = [];
        const avgUploadTimeInMS = 100;
        const itemsPerPage = 100;
        const totalItemsCount = payload.length;
        const noOfPages = Math.round((totalItemsCount) / itemsPerPage);
        console.log('noOfPages: ', noOfPages);

        /*********************
        Promise.all approach
        **********************/
        intervalID = setInterval(async () => {
            console.log('range: ', count * itemsPerPage, (count * itemsPerPage) + itemsPerPage)
            console.log('count: ', count);
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
            promises = [];
            count++;
            if (count === noOfPages) {
                console.log('clearInterval');
                clearInterval(intervalID);
                await uploadAllMedia(`${path}`, formData);
            }
        }, (totalItemsCount * avgUploadTimeInMS) / noOfPages);
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
            sizeLimit: '10mb' // Set desired value here
        }
    }
}
