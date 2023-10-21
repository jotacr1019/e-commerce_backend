import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { Auth } from "models/auth";
import { generateToken } from "lib/jwt";

export default methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        const { email, code } = req.body;
        if (!email || !code) {
            res.status(400).send({
                message: "Email and code are required",
            });
        }
        const auth = await Auth.findByEmailAndCode(email, code);
        if (!auth) {
            res.status(401).send({
                message: "Email or code not match",
            });
        }
        const hasDateExpired = auth.isCodeExpired();
        if (hasDateExpired) {
            res.status(401).send({
                message: "Code expired",
            });
        }
        const token = generateToken({ userId: auth.data.userId });
        res.status(200).send({ token });
    },
});
