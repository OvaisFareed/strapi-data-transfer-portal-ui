// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { createMany } from "@/services/api-service";

export default async function handler(req, res) {
    try {
        const { path } = req.query;
        const payload = req.body;
        const response = await createMany(`${path}`, payload);
        response.some(item => {
            if (item.status !== 200) {
                return res.status(item.status).json({
                    success: false,
                    message: "Error in creating an entry"
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
