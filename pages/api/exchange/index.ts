import type { NextApiRequest, NextApiResponse } from "next";
import { getExchangeRate } from "lib/exchangeRate";
import { corsMiddleware } from "lib/middlewares";

async function exchangeHandler(req: NextApiRequest, res: NextApiResponse) {
    const response = await getExchangeRate();

    if (!response) {
        res.status(500).send({
            message: "An error occurred",
        });
        return;
    }

    res.status(200).send(response);
}

export default corsMiddleware(exchangeHandler);
