// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { createData } from "@/services/api-service";

export default async function handler(req, res) {
    try {
        const { path } = req.query;
        const payload = req.body;
        await createData(`${path}`, payload);
        res.status(200).json({ message: "Data successfully inserted into local DB!" });
    } catch (error) {
        res.status(500).json({
            message:
                error && error.response
                    ? error.response.data
                    : "Internal Server Error.",
        });
    }
}
