import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCodeToUser } from "controllers/auth";

export default methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        const { email } = req.body;
        if (!email) {
            res.status(400).send({
                message: "Email is required",
            });
        }
        const response = await sendCodeToUser(email);
        if (!response) {
            res.status(500).send("An error occurred");
        }
        res.status(200).send(response);
    },
});
