// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { deleteAllData } from "@/services/api-service";

export default async function handler(req, res) {
    try {
        const { path } = req.query;
        await deleteAllData(`${path}`);
        res.status(200).json({ success: true, message: "All data deleted successfully!" });
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
