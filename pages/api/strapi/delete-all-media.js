// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { deleteAllMedia } from "@/services/api-service";

export default async function handler(req, res) {
    try {
        const { path } = req.query;
        await deleteAllMedia(`${path}`);
        res.status(200).json({ success: true, message: "All media deleted successfully!" });
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
