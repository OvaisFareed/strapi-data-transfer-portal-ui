// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { createMany } from "@/services/api-service";

export default async function handler(req, res) {
    try {
        console.log('req.query: ', req.query)
        const { path } = req.query;
        const payload = req.body;
        const response = await createMany(`${path}`, payload);
        response.some(item => {
            if (item.status !== 'fulfilled') {
                console.log('err resp: ', item)
                return res.status(500).json({
                    success: false,
                    message: item.status
                });
            }
        });
        res.status(200).json({ success: true, message: "Data successfully inserted into local DB!" });
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
