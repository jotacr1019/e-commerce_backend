import type { NextApiRequest, NextApiResponse } from "next";
import { getExchangeRate } from "lib/exchangeRate";

export default async function exchangeHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const response = await getExchangeRate();

    if (!response) {
        res.status(500).send({
            message: "An error occurred",
        });
        return;
    }

    res.status(200).send(response);
}
