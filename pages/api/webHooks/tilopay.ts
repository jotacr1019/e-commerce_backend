import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { verifyTransactionAndUpdateOrder } from "controllers/webHooks";

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        const tilopayData = req.query;

        const response = await verifyTransactionAndUpdateOrder(tilopayData);

        console.log("response in webhooks", response);
        res.status(200).send("code 1");
    },
});
