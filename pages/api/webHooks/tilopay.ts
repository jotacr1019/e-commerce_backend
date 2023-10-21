import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
// import { Order } from "models/order";
import { verifyTransactionAndUpdateOrder } from "controllers/webHooks";
import {
    sendSuccessfulMessageToBuyer,
    sendFailedMessageToBuyer,
    sendMessageToSeller,
} from "lib/resend";

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        const tilopayData = req.query;
        // console.log(query);
        // if (!tilopayData) {
        //     res.status(400).send({
        //         message: "query is required",
        //     });
        // }
        const response = await verifyTransactionAndUpdateOrder(tilopayData);
        if (!response) {
            sendFailedMessageToBuyer(1019, "jotaj19@hotmail.com");
            // console.log("code NOT 1");
            res.status(406).send("code NOT 1");
        }
        // sendSuccessfulMessageToBuyer();
        // sendMessageToSeller()
        // console.log("code 1");
        res.status(200).send("code 1");
    },
});
