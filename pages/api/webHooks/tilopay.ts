import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { verifyTransactionAndUpdateOrder } from "controllers/webHooks";

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        const tilopayData = req.query;

        const response = await verifyTransactionAndUpdateOrder(tilopayData);

        if (!response) {
            res.status(500).send("An error occurred");
        }
        res.status(200).send("Data received correctly from tilopay");
    },
});
