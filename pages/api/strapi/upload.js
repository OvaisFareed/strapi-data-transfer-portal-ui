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
        payload.forEach((file) => {
            // promises.push(axios.get(`${REMOTE_STRAPI_BASE_PATH}${file.url}`));
            promises.push(fetch(`${REMOTE_STRAPI_BASE_PATH}${file.url}`).then(r => r.blob()));
        });
        const result = await Promise.all(promises);
        result.forEach(blob => {
            // console.log('res: ', res)
            formData.append(`files`, blob, "test.jpg");
        });
        await uploadAllMedia(`${path}`, formData);
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
