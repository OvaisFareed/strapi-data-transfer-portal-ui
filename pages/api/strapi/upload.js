// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { uploadAllMedia } from "@/services/api-service";

export default async function handler(req, res) {
    try {
        const { path } = req.query;
        const formData = new FormData();
        const payload = req.body;
        payload.forEach((file) => {
            // formData.append(`files`, new Blob([file, { type: file.mime }]), file.name);
            const buffer = new ArrayBuffer(1024);
            formData.append(`files`, new Blob([file, new Uint16Array(buffer, 512, 128)]), file.name);
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
