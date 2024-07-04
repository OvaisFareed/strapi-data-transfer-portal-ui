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
        const promises = [];
        const promisesV2 = [];
        const itemsPerPage = 400;
        const pages = Math.floor((20) / itemsPerPage);
        const imagesArray = new Array(pages);

        /*********************
        Promise.all approach
        **********************/
        // for (let i = 0; i < imagesArray.length; i++) {
        //     const images = payload.slice(i * itemsPerPage, (i * itemsPerPage) + itemsPerPage);
        const images = payload.slice(0, itemsPerPage);
        images.forEach((file) => {
            promises.push(axios.get(`${REMOTE_STRAPI_BASE_PATH}${file.url}`, { responseType: "arraybuffer" }));
        });
        const results = await Promise.all(promises);

        results.forEach((res, index) => {
            // console.log('imagesArray res.data: ', res.data);

            const file = images[index];
            const blob = new Blob([res.data], {
                type: file.mime
            });
            formData.append(`files`, blob, file.name);
            formData.append(`refId`, `${index + 1}`);
            // promisesV2.push(uploadAllMedia(`${path}`, formData));
        });

        // };
        // console.log('formData: ', formData)
        // await Promise.all(promisesV2);
        await uploadAllMedia(`${path}`, formData);
        /* 
        ******************
        RunQueue approach
        ******************
        const queue = new RunQueue({
            maxConcurrency: 1
        });
        const images = payload.slice(0, itemsPerPage);

        function getfile(file) {
            return axios.get(`${REMOTE_STRAPI_BASE_PATH}${file.url}`, { responseType: "arraybuffer" });
        }

        queue.add(1, () => getfile(images[0]), [-1]);
        for (let i = 0; i < itemsPerPage; ++i) {
            images.forEach((file) => {
                queue.add(0, () => getfile(file), [i]);
            })
        }
        queue.run()
            .then(res => {
                console.log('imagesArray success', res);
            })
            .catch(err => {
                console.log('imagesArray err: ', err);
            })
                */

        /*  Async Parallel approach */
        // const images = payload.slice(0, itemsPerPage);
        // let i = 0;
        // images.forEach((file) => {
        //     promises.push(axios.get(`${REMOTE_STRAPI_BASE_PATH}${file.url}`, {
        //         headers: {
        //             // Accept: '*/*',
        //             'Accept-Encoding': 'gzip, deflate',
        //             Connection: 'keep-alive',
        //             'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
        //         },
        //         responseType: "arraybuffer"
        //     }));
        // });
        // await Parallel.each(promises, async value => {
        //     value.then((res) => {
        //         console.log('success', res.data)
        //     })
        //         .catch(error => {
        //             console.log('error ====> ', error?.config?.url)
        //         })
        // });
        // await uploadAllMedia(`${path}`, formData)
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
