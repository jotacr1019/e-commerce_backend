import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getProductById } from "controllers/products";

export default methods({
    get: async (req: NextApiRequest, res: NextApiResponse) => {
        const productId = req.query.productId as string;
        const product = await getProductById(productId);
        if (!product) {
            res.status(404).send({
                message: "Product not found",
            });
        }
        res.status(200).send(product);
    },
});
