import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCodeToUser } from "controllers/auth";

export default methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        try {
            const { email } = req.body;
            const userName = req.body.userName ? req.body.userName : "Usuario";
            if (!email) {
                res.status(400).send({
                    message: "Email is required",
                });
                return;
            }
            const response = await sendCodeToUser(email, userName);
            res.status(200).send(response);
        } catch (e) {
            res.status(500).send({
                message: "An error occurred",
                error: e,
            });
        }
    },
});
