// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { REMOTE_STRAPI_BASE_PATH } from "@/constants/environment";
import { uploadAllMedia } from "@/services/api-service";
import axios from "axios";
import * as fs from 'fs';
import * as filePath from 'path';

export default async function handler(req, res) {
    try {
        const { path } = req.query;
        const payload = req.body;
        const formData = new FormData();
        const promises = [];
        const promisesV2 = [];
        const itemsPerPage = 100;
        const pages = Math.floor((200) / itemsPerPage);
        const imagesArray = new Array(pages);
        for (let i = 0; i < imagesArray.length; i++) {
            const images = payload.slice(i * itemsPerPage, (i * itemsPerPage) + itemsPerPage);
            images.forEach((file) => {
                promises.push(axios.get(`${REMOTE_STRAPI_BASE_PATH}${file.url}`, { responseType: "arraybuffer" }));
            });
            Promise.all(promises)
                .then(results => {
                    // console.log('imagesArray success', results);
                    // const validResults = results.filter(result => result.status === 'fulfilled');
                    // const inValidResults = results.filter(result => result.status === 'rejected');

                    results.forEach((res, index) => {
                        const file = images[index];
                        const blob = new Blob([res.data], {
                            type: file.mime
                        });
                        formData.append(`files`, blob, file.name);
                    });
                    promisesV2.push(uploadAllMedia(`${path}`, formData));
                })
                .catch(err => {
                    console.log('imagesArray err: ', err?.config?.url);
                })
        };
        await Promise.all(promisesV2);
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
