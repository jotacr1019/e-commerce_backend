import type { NextApiRequest, NextApiResponse } from "next";
import { SyncDatabase } from "controllers/dbSync";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        await SyncDatabase(res);
    } catch (e) {
        res.status(500).send({
            message: "An error occurred",
            error: e,
        });
    }
}
