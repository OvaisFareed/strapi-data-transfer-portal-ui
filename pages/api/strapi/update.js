// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { updateData } from "@/services/api-service";

export default async function handler(req, res) {
    try {
        const { path } = req.query;
        const payload = req.body;
        await updateData(`${path}`, payload);
        res.status(200).json({ success: true, message: "Data updated successfully!" });
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
