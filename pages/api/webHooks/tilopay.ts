import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { verifyTransactionAndUpdateOrder } from "controllers/webHooks";

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        try {
            const tilopayData = req.query;

            const response = await verifyTransactionAndUpdateOrder(tilopayData);

            if (!response) {
                res.status(500).send(
                    "The transaction was not completed correctly"
                );
            }
            res.status(200).send("Data received correctly from tilopay");
        } catch (e) {
            res.status(500).send({
                message: "An error occurred",
                error: e,
            });
        }
    },
});
