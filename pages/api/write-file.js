import * as fs from "fs";
import path from "path";

export default async function handler(req, res) {
    try {
        const { fileName } = req.query;
        const payload = req.body;
        const filePath = path.resolve(__dirname, "../../../../");
        console.log(`${filePath}\\${fileName}`)
        fs.writeFileSync(`${filePath}\\${fileName}`, JSON.stringify(payload));
        res.status(200).json({ success: true, message: "File is written successfully!" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error && error.message
                    ? error.message
                    : "Internal Server Error.",
        });
    }
}